import type { Context } from 'koa'
import bcrypt from 'bcryptjs'
import { config } from './config'
import { omit, type SigninRequest } from '@hive/shared'

class AuthService {
  static async signup(ctx: Context) {
    const { email, password } = ctx.request.body as SigninRequest

    const salt = await bcrypt.genSalt(config.saltRounds)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await ctx.prisma.user.create({
      data: { email, hash: passwordHash },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    ctx.status = 201
    ctx.body = newUser
  }

  static async signin(ctx: Context) {
    const { email, password: candidatePassword } = ctx.request
      .body as SigninRequest

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      ctx.status = 404
      ctx.body = 'User not found'
      return
    }

    const isValid = await bcrypt.compare(candidatePassword, user.hash)

    if (!isValid) {
      ctx.status = 401
      ctx.body = 'Incorrect password'
      return
    }

    ctx.status = 200
    ctx.body = omit(user, ['hash'])
  }

  static async me(ctx: Context) {
    const userId = ctx.params.id

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      ctx.status = 404
      ctx.body = 'User not found'
      return
    }

    ctx.status = 200
    ctx.body = omit(user, ['hash'])
  }
}

export default AuthService
