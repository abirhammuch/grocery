
import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const connectionUrl = new URL(mongoUri);
  if (!connectionUrl.pathname || connectionUrl.pathname === "/") {
    connectionUrl.pathname = "/grocery";
  }

  mongoose.connection.once("connected", () => {
    console.log("Database connected successfully");
  });

  await mongoose.connect(connectionUrl.toString());
};

export default connectDB;