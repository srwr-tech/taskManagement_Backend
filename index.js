import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './module/login/routes/authRoutes.js';
import cors from 'cors';

dotenv.config();  // Load environment variables

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGO_URL);
    console.log("Database Connected Successfully...");

    // Start the server after database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);  // Exit process with failure
  }
};

// Call the connect function to establish the connection to MongoDB Atlas
connectDB();
