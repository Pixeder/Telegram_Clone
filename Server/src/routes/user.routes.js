import { Router } from 'express'
import { loginUser , registerUser , logoutUser } from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middlware.js'


const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(verifyJWT , logoutUser)


export default userRouter