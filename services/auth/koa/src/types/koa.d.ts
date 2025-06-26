import { PrismaClient } from '../model/client'
import 'koa'

declare module 'koa' {
  interface DefaultContext {
    prisma: PrismaClient
  }
}
