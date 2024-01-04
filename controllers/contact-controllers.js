import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';
import {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteScheme,
} from '../models/Contact.js';

export const getAll = async (req, res,next) => {
  try {
      const { _id: owner } = req.user;
        const result = await Contact.find({owner});
        res.json(result);
    }
    catch (error){
            next(error)
        }
};

export const getById = async (req, res,next) => {
  try {
    const { contactId: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id, owner });
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
      const { _id: owner } = req.user;
      const result = await Contact.create({...req.body, owner }) 
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
         const { contactId: _id } = req.params;
         const { _id: owner } = req.user;
         const result = await Contact.findOneAndUpdate({ _id, owner },req.body);
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
    const { error } = contactUpdateFavoriteScheme.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      req.body
    );
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
    try {
         const { contactId: _id } = req.params;
         const { _id: owner } = req.user;
         const result = await Contact.findOneAndDelete({ _id, owner });
    if (!result) {
      throw HttpError(404, `not found`);
        }
        res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
};

