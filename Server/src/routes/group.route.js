import { Router } from 'express'
import { 
  createGroup , 
  deleteGroup , 
  addAdmin , 
  addMember , 
  removeAdmin , 
  removeMember , 
  getGroups } from '../controllers/group.controller'
import verifyJWT from '../middlewares/verifyJWT'

const groupRouter = Router()

groupRouter.route('/create')
    .post(verifyJWT , createGroup)

groupRouter.route('/delete')
    .post(verifyJWT , deleteGroup)

groupRouter.route('/add-admin')
    .post(verifyJWT , addAdmin)

groupRouter.route('/add-member')
    .post(verifyJWT , addMember)

groupRouter.route('/remove-admin')
    .post(verifyJWT , removeAdmin)

groupRouter.route('/remove-member')
    .post(verifyJWT , removeMember)

groupRouter.route('/get-groups')
    .get(verifyJWT , getGroups)

export default groupRouter