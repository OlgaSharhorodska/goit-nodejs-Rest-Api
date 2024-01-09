import multer from 'multer';
import path from 'path';
import { HttpError } from '../helpers/index.js';

const destination = path.resolve('temp');

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
