import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { HttpError, sendEmail } from '../helpers/index.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import 'dotenv/config';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsDir = path.resolve('public', 'avatars');

const register = async (req, res) => {
    const { email,password } = req.body;
    const user = await User.findOne({email})
    if (user) {
        throw HttpError(409, 'Email in use');
    }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL,
  });
  const { subscription } = newUser;
    
  const verifyEmail = {
      to: email,
      subject: 'Verify your email',
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    };

  await sendEmail(verifyEmail);
 
   res.status(201).json({
     user: {
       email: newUser.email,
       subscription,
     },
   });
}

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
  
  res.json({message:"Verification successful"})
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400,"Email not found")
  }
   if (user.verify) {
     throw HttpError(400, 'Verification has already been passed');
  }
  
   const verifyEmail = {
     to: email,
     subject: 'Verify your email',
     html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
   };

  await sendEmail(verifyEmail);
  
  res.json({
    message: 'Verification email sent'
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
   throw HttpError(401, 'Email not verify'); 
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const { _id: id, subscription } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  await User.findByIdAndUpdate(id, { token });
  res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  if (!email || !subscription) {
    throw HttpError(401, 'Not authorized');
  }
  res.json({
    email,
    subscription,
  });
}

const logout = async (req, res) =>
{
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json();
  
}

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'Bad Request');
    }

    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    await Jimp.read(tmpUpload)
      .then((image) => image.resize(250, 250))
      .then((image) => image.write(resultUpload));

    await fs.unlink(tmpUpload);

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    // console.error('Error updating avatar:', error.message);
    res.status(400).json({ error: error.message });
  }
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar:ctrlWrapper(updateAvatar),
};