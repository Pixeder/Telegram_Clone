import { Router } from 'express'
import { loginUser , registerUser , logoutUser , getUsersList } from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middlware.js'


const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT , logoutUser)
userRouter.route('/getlist').get(verifyJWT , getUsersList)

export default userRouter