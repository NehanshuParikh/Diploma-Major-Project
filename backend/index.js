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
import cron from 'node-cron';
import { Permission } from './models/permissionModel.js';

dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on where your frontend is running
    credentials: true,
}));

app.use(express.json()); // it allows us to pass the incoming requests as json payloads ( req.body )
app.use(cookieParser()); // it allows us to pass the cookies




// Run a cron job every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        // Delete all permissions that have expired
        await Permission.deleteMany({ expiresAt: { $lt: now } });
        console.log('Expired permissions deleted');
    } catch (error) {
        console.error('Error deleting expired permissions:', error);
    }
});


app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/marksManagement", marksRoutes)
app.use("/api/reports", reportRoutes);

// routes for frontend 
app.use("/api/user", profileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})