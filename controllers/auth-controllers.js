import User from "../models/User.js";
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';

const signup = (req, res) => {
    
}


export default {
  signup: ctrlWrapper(signup),

};