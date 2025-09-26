import express from "express";
import blogRoute from "./routes/blogRoute.js";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";

dotenv.config();

dbConnection();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/v1/blog", blogRoute);
app.use("/v1/product", productRoute);
app.use("/v1/user", userRoute);
app.use("/v1/auth", authRoute);

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.listen(port, () => {
  console.log("server listen on port: ", port);
});

export default app;
