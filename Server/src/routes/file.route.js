import { Router } from 'express';
import { uploadFile } from '../controllers/file.controller.js';
import { upload } from '../middleware/multer.middlware.js';
import { verifyJWT } from '../middleware/auth.middlware.js';

const fileRouter = Router();

fileRouter.route('/uploadSignUpAvatar').post(upload.single('file'), uploadFile);

fileRouter.route('/upload').post(verifyJWT, upload.single('file'), uploadFile);

export default fileRouter;
