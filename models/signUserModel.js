import mongoose from "mongoose";

const SignUserSchema = new mongoose.Schema(
  {
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    college: String,
    phno: { type: String, length: 10 },
    year: String,
    branch: String,
    collegeId: String,
  },
  {
    timestamps: true,
  }
);

const SignUser = mongoose.model("SignUser", SignUserSchema);
export default SignUser;
