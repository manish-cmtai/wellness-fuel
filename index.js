import express from "express";
import blogRoute from "./routes/blogRoute.js";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import cors from "cors";
import ratingRouter from "./routes/ratingRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import orderRoutes from './routes/orderRoute.js';
import leadRoutes from './routes/leadRoute.js';
import addressRoutes from './routes/addressRouter.js';
import couponRoutes from './routes/couponRouter.js';
import reviewRoutes from './routes/reviewRouter.js';
import cookieParser from "cookie-parser";
import settingRoutes from './routes/settingRoute.js';
import notesRoute from './routes/notesRoute.js';
import sessionRoute from './routes/sessionRoute.js';
import popupRoute from './routes/popupRoute.js'

dotenv.config();

dbConnection();

const port = process.env.PORT;

const app = express();

app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://wellness-fuel.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/v1/blogs", blogRoute);
app.use("/v1/products", productRoute);
app.use("/v1/users", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/ratings", ratingRouter);
app.use("/v1/categories", categoryRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/leads', leadRoutes);
app.use('/v1/addresses', addressRoutes);
app.use('/v1/coupons', couponRoutes);
app.use('/v1/reviews', reviewRoutes);
app.use('/v1/settings', settingRoutes);
app.use('/v1/notes', notesRoute);
app.use('/v1/sessions', sessionRoute);
app.use('/v1/popups', popupRoute);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log("server listen on port: ", port);
});

export default app;
