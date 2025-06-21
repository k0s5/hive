import Router from '@koa/router'
import { signin, signup, me } from './controller'

const router = new Router({ prefix: '/auth' })

router.post('/signin', signin)

router.post('/signup', signup)

router.get('/me/:id', me)

export default router
