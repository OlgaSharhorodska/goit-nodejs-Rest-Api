import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks";
import Joi from 'joi';

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
})
  
contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", addUpdateSettings )
contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'missing required name field',
  }),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'any.required': 'missing required email field' }),
  phone: Joi.string()
    .required()
    .messages({ 'any.required': 'missing required phone field' }),
  favorite:Joi.boolean().required()
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean().required()
}); 

export const contactUpdateFavoriteScheme = Joi.object({
    favorite: Joi.boolean().required()
})

const Contact = model("contact", contactSchema);

export default Contact;