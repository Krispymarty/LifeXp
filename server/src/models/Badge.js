import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'Award'
    },
    unlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Badge', badgeSchema);
