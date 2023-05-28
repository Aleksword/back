import ThreadModel from '../models/Thread.js';

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

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось вернуть статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const threadId = req.params.id;

    ThreadModel.findOneAndDelete(
      {
        _id: threadId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new ThreadModel({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const thread = await doc.save();

    res.json(thread);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const threadId = req.params.id;

    await ThreadModel.updateOne(
      {
        _id: threadId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};