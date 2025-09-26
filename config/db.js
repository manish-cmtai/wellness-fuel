
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const uri=process.env.DB_URL
const dbConnection= async()=>{

  try {
   await mongoose.connect(process.env.DB_URL)
    console.log("data base connected");
    
} catch (error) {
   console.log(uri);
    
    throw new Error("data base not connected");
    
}
}
export default dbConnection
