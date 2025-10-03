import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import passwordCheck from "../utils/passwordCheck.js";
import {UAParser} from "ua-parser-js";

export const login= async(req,res)=>{
    const {email,password}=req.body
    
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] ||  req.socket.remoteAddress;
     const userAgent = req.headers["user-agent"];
     console.log(ip,userAgent);
     
    if(!email||!password){
        res.status(403).json({
            message:"All Detail Required"
        })
    }

    try {
        const user = await User.findOne({email})
     
        
        if(!user){
            res.status(404).json({
                message:"User Not Found"
            })
        }
        const checkedPassword = await passwordCheck(password,user.password)
 
        
        if(!checkedPassword){
            res.status(404).json({
                message:" Detail Wrong"
            })
        }
          const token = generateToken(user._id)

            const parser = new UAParser(req.headers["user-agent"]);
             const deviceInfo = parser.getResult();
          const session= await Session.create({
            user:user._id,
            userAgent,
            ipAddress:ip,
            isValid:true,
            createdAt:Date.now(),
            expiresAt:Date.now() +  24*60*60*1000,
            token,
            deviceInfo

          })
          
       return res.status(200).cookie("token",token).json({
            message:"login",
            session
        })
    } catch (error) {
        console.log("login problem");
        res.status(500).json({
            message:"Backend Error",
            error:error.message
        })
    }
}

export const logout = async (req,res)=>{
     try {
        res.status(200)
        .clearCookie("token")
        .json({
         message:"logout"
        })
    } catch (error) {
        res.status(500)
        .clearCookie("token")
        .json({
         message:"server error"
        })
    }
}
export const check=async(req,res)=>{
    try {
        res.status(200).json({
            user:req.user
        })
    } catch (error) {
        console.log(error +' check problem');
        
        res.status(500)
        .json({
         message:"server error"
        })
    }
}