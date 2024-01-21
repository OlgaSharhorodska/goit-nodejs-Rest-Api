import express from 'express';

import authControllers from '../../controllers/auth-controllers.js';

import {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} from '../../models/User.js';

import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidId.js';
import upload from '../../middlewares/upload.js';
import  validateBody  from '../../helpers/validateBody.js';
import authenticate from '../../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(userSignupSchema), authControllers.register)

authRouter.get('/verify/:verificationToken', authControllers.verify);

authRouter.post('/verify', isEmptyBody,validateBody(userEmailSchema), authControllers.resendVerifyEmail )

authRouter.post('/login', isEmptyBody, validateBody(userSigninSchema),authControllers.login);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.logout)

authRouter.patch('/avatars', authenticate, upload.single('avatar'), authControllers.updateAvatar)

export default authRouter;
