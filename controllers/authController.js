import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import passwordCheck from "../utils/passwordCheck.js";

export const login= async(req,res)=>{
    const {email,password}=req.body
    
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
          
        res.status(200).cookie("token",token).json({
            message:"login"
        })
    } catch (error) {
        console.log("login problem");
        res.status(500).json({
            message:"Backend Error"
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