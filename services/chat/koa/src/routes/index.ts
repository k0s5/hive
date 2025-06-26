import Router from '@koa/router'
import { getMessages } from '../controller'

const router = new Router({ prefix: '/chat' })

router.get('/:id', getMessages)

export default router
