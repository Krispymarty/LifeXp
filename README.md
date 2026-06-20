# Life XP

Life XP is a full-stack gamified self-growth platform where users log real-life experiences and earn XP, levels, skills, classes, and badges.

## Stack

- React, Vite, Tailwind CSS, React Router, Recharts
- Node.js, Express.js
- MongoDB with Mongoose

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the backend:

   ```bash
   cp server/.env.example server/.env
   ```

   Set `MONGODB_URI` or `MONGO_URI` if you are not using the default local MongoDB URL.
   For MongoDB Atlas, put your real connection string in `server/.env`, not in `.env.example`.

   To start a local MongoDB with Docker:

   ```bash
   docker compose up -d
   ```

3. Seed sample data:

   ```bash
   npm run seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`
