import 'dotenv/config'
import Koa, { type BaseContext } from 'koa'
import cors from '@koa/cors'
import { bodyParser } from '@koa/bodyparser'
import { PrismaClient } from '@prisma/client'
import router from './routes'
import prisma from './providers/prisma'

const app = new Koa()

app.use(
  cors({
    origin: `http://localhost:${process.env.GATEWAY_PORT}`,
    credentials: true,
  })
)

// Middleware для добавления Prisma в контекст
app.context.prisma = prisma

app.use(bodyParser())

// Error Handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err: any) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      message: err.message,
    }
  }
})

app.use(router.routes())
// app.use(router.allowedMethods())

const PORT = process.env.PORT || 4001

let isGracefulShutdownStarted = false

async function gracefulShutdown(signal: string) {
  if (isGracefulShutdownStarted) {
    return
  }
  console.log(`Received ${signal}, shutting down gracefully...`)
  isGracefulShutdownStarted = true

  if (prisma) {
    await prisma.$disconnect()
  }

  process.exit(1)

  // setTimeout(() => {
  //   console.error('Forced shutdown due to timeout')
  //   process.exit(1)
  // }, 5000) // 5 seconds
}

// Signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

app.listen(PORT)
console.log(`Auth service started on port ${PORT}`)
