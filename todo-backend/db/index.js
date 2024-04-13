import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const dbconnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${dbconnection.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error.message);
    process.exit(1);
  }
};

export default connectDB;
