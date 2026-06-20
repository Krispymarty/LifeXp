import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    date: {
      type: Date,
      required: true
    },
    xpEarned: {
      type: Number,
      required: true,
      min: 0
    },
    extractedSkills: [
      {
        name: { type: String, required: true },
        xp: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
