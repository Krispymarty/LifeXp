import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    xp: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
