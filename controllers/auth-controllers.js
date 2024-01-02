import bcrypt from 'bcrypt';
import User from "../models/User.js";
import { HttpError } from '../helpers/index.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';

const signup = async (req, res) => {
    const { email,password } = req.body;
    const user = await User.findOne({email})
    if (user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });
    
   res.json({
     username: newUser.username,
     email: newUser.email,
   });
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const token = "124.5333.555"
    res.json({ token });
}

export default {
    signup: ctrlWrapper(signup),
    signin:ctrlWrapper(signin),
};