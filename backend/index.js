import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import marksRoutes from './routes/marksRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on where your frontend is running
    credentials: true,
}));

app.use(express.json()); // it allows us to pass the incoming requests as json payloads ( req.body )
app.use(cookieParser()); // it allows us to pass the cookies


app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/marksManagement", marksRoutes)
app.use("/api/reports", reportRoutes);
app.use("/api/user", profileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})