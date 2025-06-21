import type { Context } from 'koa'
import AuthService from './service'

export async function signup(ctx: Context) {
  await AuthService.signup(ctx)
}

export async function signin(ctx: Context) {
  await AuthService.signin(ctx)
}

export async function me(ctx: Context) {
  await AuthService.me(ctx)
}
