import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import commentRoutes from './routes/commentRoutes.js'; // Import the comment routes
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';



const app = express();
app.use(express.json());
app.use(cors());

//Route definitions for API endpoints used by the frontend
app.use('/api/auth', authRoutes); //authentication routes
app.use('/api/users', userRoutes); //user routes
app.use('/api/projects', projectRoutes); //project routes
app.use('/api/comments', commentRoutes); //comment routes


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => console.error('MongoDB connection error:', err));