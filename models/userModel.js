import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["Admin", "Doctor", "Influencer", "Customer"],
      default: "Customer",
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    dateOfBirth: { type: Date },
    verified: { type: Boolean, default: false },
    address: { type: String },
    bio: { type: String },
    hospital:{
      type:String,
    },
    experience:{
      type:Number,
    },
    consultationFee:{
      type:Number,
    },
    specialization:{
      type:String,
      enum:["Cardiology","Neurology","Orthopedics","Pediatrics","Dermatology","Ophthalmology"]
    },
    location:{
      type:String
    },
    qualifications:{
      type:String
    },
    platform:{
      type:String
    },
    followers:{
      type:Number
    },
    category:{
      type:String
    },
    socialMediaLinks:{
      type:String
    },
    commissionRate:{
      type:Number
    },
    availability:{
      type:String
    },
    note:{
      type:String
    },
    customerType:{
      type:String
    },
    isActive:{
      type:Boolean,
      default:true
    },
    language:[{
      type:String
    }]

  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
