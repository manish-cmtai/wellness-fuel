import express from "express";
import blogRoute from "./routes/blogRoute.js";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import cors from "cors";
import ratingRouter from "./routes/ratingRoute.js";

dotenv.config();

dbConnection();

const port = process.env.PORT;

const app = express();

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

app.use("/v1/blog", blogRoute);
app.use("/v1/product", productRoute);
app.use("/v1/user", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/rating", ratingRouter);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log("server listen on port: ", port);
});

export default app;
