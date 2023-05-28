import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';
import { registerValidation, loginValidation, threadCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, ThreadController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://адресс БД в монго')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register); 
app.post('/logout', (req, res) => {
  res.sendStatus(200);
});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/threads/:id', ThreadController.getOne);
export const getOne = async (req, res) => {
  try {
    const threadId = req.params.id;

    const doc = await ThreadModel.findOneAndUpdate(
      {
        _id: threadId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      }).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    console.log('Статья:', doc); 
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось вернуть статью',
    });
  }
};

app.post('/threads', checkAuth, threadCreateValidation, handleValidationErrors, ThreadController.create);
app.delete('/threads/:_id', checkAuth, ThreadController.remove);
app.patch(
  '/threads/:_id',
  threadCreateValidation,
  handleValidationErrors,
  ThreadController.update,
);

app.listen(process.env.PORT || 8888, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
