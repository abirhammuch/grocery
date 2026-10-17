import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

try {
  await connectDB();
  await connectCloudinary();
  console.log("All connections established successfully");
} catch (error) {
  console.error("Failed to connect to services:", error.message);
  process.exit(1); // Exit if connections fail
}

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://grocery-neon-kappa.vercel.app",
  "https://grocery-gray-psi.vercel.app",
  "https://grocery-backend-livid-six.vercel.app",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

// Webhook MUST come before express.json()
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-seller-token"],
  }),
);

// Handle preflight requests
// app.options('*', cors());  // Removed this line as it's causing an error and is redundant
// Middleware configuration
app.use(express.json());
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  console.log("Origin:", req.headers.origin);
  next();
});

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// Export the app for Vercel serverless functions
export default app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
