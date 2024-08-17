import express from 'express'
import dotenv from "dotenv"
import { connectDB } from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import marksRoutes from './routes/marksRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config()
const PORT = process.env.PORT || 5000; 

const app = express();

app.use(express.json()); // it allows us to pass the incoming requests as json payloads ( req.body )
app.use(cookieParser()); // it allows us to pass the cookies


app.use("/api/auth", authRoutes)
app.use("/api/marksManagement", marksRoutes)
app.use("/api/reports", reportRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})

// pG1Ts0ZWZMSUKO1A