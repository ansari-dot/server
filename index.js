import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan());
app.use(cors({
    origin: 'https://shehrity.netlify.app',
    credentials: true,
  }));
// Routes
app.use('/api', userRoutes);

// Root test route
app.get('/', (req, res) => {
    res.send("Backend API is running...");
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });