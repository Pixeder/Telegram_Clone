import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middlware.js'
import { getUserMessages , getGroupMessages } from '../controllers/message.controller.js'

const messageRouter = Router()

messageRouter.use(verifyJWT)

messageRouter.route('/:recipientId')
  .get( getUserMessages )

messageRouter.route('/groups/:groupId')
  .get( getGroupMessages )

export default messageRouter