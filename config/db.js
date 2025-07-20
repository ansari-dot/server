// Import mongoose and dotenv
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fallback URI if MONGO_URI not provided
const uri = process.env.MONGO_URI || 'mongodb+srv://073ansari:ansari@guesthouse.gyhavro.mongodb.net/client';

const connectDB = async () => {
  try {
    const response = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB connected: ${response.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
