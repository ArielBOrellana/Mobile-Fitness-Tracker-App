import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
// import workoutRouter from './routes/workout.route.js'; // You will create this later!

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err);
});

const app = express();

// 2. Simplify CORS for Mobile
// During development, it is best to allow ALL origins to prevent connection issues from your phone.
app.use(cors()); 

app.use(express.json());
app.use(cookieParser());

// 3. Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
// app.use('/api/workout', workoutRouter); 

// 4. Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});