
import mongoose from "mongoose";

let connectionPromise;

mongoose.connection.on("disconnected", () => {
  connectionPromise = undefined;
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  const connectionUrl = new URL(mongoUri);
  if (!connectionUrl.pathname || connectionUrl.pathname === "/") {
    connectionUrl.pathname = "/grocery";
  }

  if (!connectionPromise) {
    mongoose.connection.once("connected", () => {
      console.log("Database connected successfully");
    });

    connectionPromise = mongoose.connect(connectionUrl.toString()).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
};

export default connectDB;