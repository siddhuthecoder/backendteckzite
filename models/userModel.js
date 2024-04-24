import mongoose from "mongoose";
import { getNextSequenceValue } from "./countModel.js";

const UserSchema = new mongoose.Schema(
  {
    tzkid: String,
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    college: String,
    phno: { type: String, length: 10 },
    year: String,
    branch: String,
    collegeId: String,
    amountPaid: String,
    gender: String,
    referredBy: String,
    img: String,
    state: String,
    district: String,
    city: String,
    sub: { type: String, unique: true },
    idUpload: String,
    refreals: {
      type: [{ type: String }],
      default: [],
    },
    regEvents: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
      default: [],
    },
    regWorkshop: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workshop" }],
      default: [],
    },
    razorpay_order_id: String,
    mode: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.tzkid) {
    try {
      const sequenceValue = await getNextSequenceValue("tzkid_counter");
      this.tzkid = `tzk24${sequenceValue.toString().padStart(4, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

const User = mongoose.model("User", UserSchema);
export default User;
