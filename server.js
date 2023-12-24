import mongoose from 'mongoose';
import app from './app.js';

const DB_HOST =
  'mongodb+srv://Olga:TdJEvSLYSRGssePw@cluster0.ulousdv.mongodb.net/contacts?retryWrites=true&w=majority';
mongoose.connect(DB_HOST).then(() => {
  app.listen(3000, () => {
    console.log('Database connection successful');
  });
}).catch(error=>{
  console.log(error);
  process.exit(1);
})



