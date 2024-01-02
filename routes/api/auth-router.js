import express from 'express';
import { userSignupSchema, userSigninSchema } from '../../models/User.js';

import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidId.js';
import  validateBody  from '../../helpers/validateBody.js';

const authRouter = express.Router();

authRouter.post('/signup', isEmptyBody, validateBody(userSignupSchema))


export default authRouter;
