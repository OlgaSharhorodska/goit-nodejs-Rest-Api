import express from 'express';
import {
  getAll,
  getById,
  addNewContact,
  updateById,
  deleteById,
  updateStatusContact,
} from '../../controllers/contact-controllers.js';

import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidId.js';
import authenticate from '../../middlewares/authenticate.js';
import upload from '../../middlewares/upload.js';

const router = express.Router()

router.use(authenticate);

router.get('/', getAll);

router.get('/:contactId',isValidId, getById)

router.post('/',upload.single('avatar'), isEmptyBody, addNewContact);

router.delete('/:contactId',isValidId, deleteById)

router.put('/:contactId', isValidId, isEmptyBody, updateById);

router.patch(
  '/:contactId/favorite',
  isValidId,
  isEmptyBody,
  updateStatusContact
);

export default router;
