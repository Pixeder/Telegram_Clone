import { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middlware.js'
import { getMessages } from '../controllers/message.controller.js'

const messageRouter = Router()

messageRouter.route('/:recipientId')
  .get(verifyJWT , getMessages)

export default messageRouter