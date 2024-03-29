import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import translateRoutes from "./routes/translateRoutes.js";
import cookieParser from 'cookie-parser';

const app = express()
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Server is up and running"
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// console.log(process.env.FRONTEND_URL);
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/translate', translateRoutes);

export default app