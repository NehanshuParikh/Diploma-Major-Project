import mongoose from "mongoose"

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error while connecting to the Databse: ", error.message)
        process.exit(1) // 0 -> success and 1 -> failure
    }
}