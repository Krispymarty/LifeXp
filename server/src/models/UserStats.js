import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
  {
    totalXP: {
      type: Number,
      default: 0,
      min: 0
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    experiencesCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('UserStats', userStatsSchema);
