import { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    name: { type: String, required: true,unique:true },
    review: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);

export default Review;
