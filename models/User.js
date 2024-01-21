import { Schema, model } from 'mongoose';
import { handleSaveError, addUpdateSettings } from './hooks.js';
import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', addUpdateSettings);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userSignupSchema = Joi.object({
  // username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model('user', userSchema);

export default User;