import mongoose from "mongoose";

// Define the schema
const userQRSchema = new mongoose.Schema({
  tzkid: { type: String },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  college: { type: String },
  phno: { type: Number },
  year: { type: String },
  branch: { type: String },
  collegeId: { type: String },
  amountPaid: { type: Number },
  gender: { type: String },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  mode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  referredBy: { type: String },
  rezorpay_order_id: { type: String },
  refreals: [{ type: String }],
  regEvents: [{ type: String }],
  regWorkshop: [{ type: String }]
});

// Create a model from the schema
const UserQRModel = mongoose.model('UserQRModel', userQRSchema);

export default UserQRModel;
