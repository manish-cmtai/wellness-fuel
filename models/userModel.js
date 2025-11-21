import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["Admin", "Doctor", "Influencer", "Customer"],
      default: "Customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "discharged", "emergency"],
      default: "active",
    },
    imageUrl: {
      type: String,
      default: ""
    },
    dateOfBirth: {
      type: Date
    },
    age: {
      type: Number
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    location: {
      type: String
    },
    patientType: {
      type: String,
      enum: ["new", "regular", "vip", "emergency"],
      default: "new",
    },
    medicalHistory: [{
      type: String
    }],
    currentMedications: [{
      type: String
    }],
    allergies: [{
      type: String
    }],
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    insuranceProvider: {
      type: String
    },
    tags: [{
      type: String
    }],
    notes: {
      type: String
    },
    hospital: {
      type: String
    },
    experience: {
      type: Number
    },
    consultationFee: {
      type: Number
    },
    specialization: {
      type: String
    },
    qualifications: {
      type: String
    },
    availability: {
      type: String
    },
    language: [{
      type: String
    }],
    platform: {
      type: String
    },
    followers: {
      type: Number
    },
    category: {
      type: String
    },
    socialMediaLinks: {
      type: String
    },
    commissionRate: {
      type: Number
    },
    occupation: {
      type: String
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },

    //customer routes
    paymentMethods: [{
      cardType: { type: String, required: true },
      cardNumber: { type: String, required: true },
      cardHolderName: { type: String, required: true },
      expiryDate: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;