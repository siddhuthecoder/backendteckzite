import mongoose from "mongoose";

const adminModel = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  role: { type: String },
});

const Admin = mongoose.model("Admin", adminModel);
export default Admin;
