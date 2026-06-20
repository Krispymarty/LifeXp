import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/life-xp';

async function start() {
  let demoMode = process.env.LIFE_XP_DEMO === 'true';

  if (!demoMode) {
    try {
      await connectDB(mongoUri);
    } catch (error) {
      if (process.env.REQUIRE_MONGO === 'true') {
        console.error('Failed to start server:', error.message);
        process.exit(1);
      }

      demoMode = true;
      console.warn(`MongoDB unavailable (${error.message}). Starting API in demo mode.`);
    }
  }

  const app = createApp({ demoMode });

  app.listen(port, () => {
    console.log(`Life XP API running on http://localhost:${port}${demoMode ? ' (demo mode)' : ''}`);
  });
}

start();
