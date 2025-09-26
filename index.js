import express from "express"
import blogRoute from "./routes/blogRoute.js"
import productRoute from "./routes/productRoutes.js"
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import dotenv from "dotenv"
import dbConnection from "./config/db.js"

dotenv.config()

const port=process.env.PORT


const app =express()

app.use(express.json())

app.use("/api/blog",blogRoute)
app.use("/api/product",productRoute)
app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)


app.listen(port,()=>{
    dbConnection()
    console.log("server listen on port: ",port); 
})

export default app
