import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ninjago",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
            }
        )
        console.log(`DB connected : ${conn.connection.host} `)
    } catch (error) {
        console.error("connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;