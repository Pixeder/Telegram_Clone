import { Router } from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUsersList,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middlware.js';
import { upload } from '../middleware/multer.middlware.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);

userRouter.route('/login').post(loginUser);

userRouter.route('/logout').post(verifyJWT, logoutUser);

userRouter.route('/').get(verifyJWT, getUsersList);

export default userRouter;
