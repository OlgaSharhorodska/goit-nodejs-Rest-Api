import multer from 'multer';
import path from 'path';
import { HttpError } from '../helpers/index.js';

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
    destination,
    filename: (req, file, callback) => {
         const uniquePreffix = `${Date.now()}_${Math.round(
           Math.random() * 1e9
        )}`;
        const filename = `${uniquePreffix}_${file.originalname}`;
        callback(null, filename);
    }    
})

const limits = {
    fileSize: 1024 * 1024 * 5,
}

const fileFilter = (req, file, callback) => {
  const fileExtation = ['jpeg', 'png', 'bmp', 'tiff', "gif", "jpg"]
    const extension = file.originalname.split(".").pop();
    if (!fileExtation.includes(extension)) {
    callback(HttpError(400, "Is not valid extension"));
  }
  callback(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter
})

export default upload;