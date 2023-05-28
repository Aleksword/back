import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Thread', ThreadSchema);