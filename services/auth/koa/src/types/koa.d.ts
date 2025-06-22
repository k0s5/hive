import { PrismaClient } from '@prisma/client'
import 'koa'

declare module 'koa' {
  interface DefaultContext {
    prisma: PrismaClient
  }
}
