import express from 'express';
import {
  getAll,
  getById,
  addNewContact,
  updateById,
  deleteById,
} from '../../controllers/contact-controllers.js';

import isEmptyBody from '../../middlewares/isEmptyBody.js';
import isValidId from '../../middlewares/isValidId.js';

const router = express.Router()

router.get('/', getAll);

router.get('/:contactId',isValidId, getById)

router.post('/', isEmptyBody, addNewContact);

router.delete('/:contactId',isValidId, deleteById)

router.put('/:contactId', isValidId, isEmptyBody, updateById);

router.patch('/:contactId/favorite', isValidId, isEmptyBody, updateById);

export default router;
