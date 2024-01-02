import express from 'express';

import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidId.js';

const authRouter = express.Router();

export default authRouter;
