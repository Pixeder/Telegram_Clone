import { Router } from 'express'
import { 
  createGroup , 
  deleteGroup , 
  addAdmin , 
  addMember , 
  removeAdmin , 
  removeMember , 
  getGroupMessages ,
  getGroups } from '../controllers/group.controller.js'
import { verifyJWT } from '../middleware/auth.middlware.js'

const groupRouter = Router()

groupRouter.use(verifyJWT)

groupRouter.route('/')
    .get(getGroups)
    .post(createGroup)

groupRouter.route('/:groupId/members')
    .patch(addMember)
    .delete(removeMember)

groupRouter.route('/:groupId/admins')
    .patch(addAdmin)
    .delete(removeAdmin)

groupRouter.route('/:groupId')
    .delete(deleteGroup)

groupRouter.route('/:groupId/messages')
    .get(getGroupMessages)

export default groupRouter