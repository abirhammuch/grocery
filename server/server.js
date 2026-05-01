import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';



const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

//allowed multiple origines
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://grocery-neon-kappa.vercel.app',  // ← YOUR FRONTEND URL
    'https://grocery-backend-livid-six.vercel.app',
    /\.vercel\.app$/  // Allow all vercel.app subdomains
]


app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

//Middleware configration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.get('/', (req, res)=>res.send("API is working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)


app.listen(port, ()=>{
  console.log(`Server is running on http://localhost:${port}`)
})
