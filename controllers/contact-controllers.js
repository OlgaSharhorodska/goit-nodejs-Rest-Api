import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteScheme,
} from '../models/Contact.js';

export const getAll = async (req, res,next) => {
    try {
        const result = await Contact.find();
        res.json(result);
    }
    catch (error){
            next(error)
        }
};

export const getById = async (req, res,next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
      if (!result) {
          throw HttpError(404, `Not found`);
      }
      res.json(result);
  } catch (error) {
      next(error);
  }
};

export const addNewContact = async (req, res, next) => {
    try {
        const {error} = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }    
    const result = await Contact.create(req.body) 
    res.status(201).json(result)    
  } catch (error) {
    next(error);
  }
};

export const updateById = async (req, res, next) => {
  try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
      }
      const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
      if (!result) {
       throw HttpError(404, 'Not found');
      }
      res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!req.body) {
      throw HttpError(400, 'Missing field favorite');
    }
    const { error } = contactUpdateFavoriteScheme.validate(req.body);

    if (error) {
      throw HttpError(400, 'Missing field favorite');
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw HttpError(404, `not found`);
        }
        res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

