import { model, Schema } from "mongoose";

const appointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
}, { timestamps: true });

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
