import 'dotenv/config'
import Koa from 'koa'
import cors from '@koa/cors'
import { bodyParser } from '@koa/bodyparser'
import { PrismaClient } from '@prisma/client'
import router from './routes'

const app = new Koa()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_DB_HOST || 'localhost'}:${process.env.POSTGRES_DB_PORT || 5432}/${process.env.POSTGRES_DB_NAME}?schema=public`,
    },
  },
})

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

app.listen(PORT)
console.log(`Auth service started on port ${PORT}`)
