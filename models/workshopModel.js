import mongoose from "mongoose";

const regStudentsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  idNumber: {
    type: String,
    required: true,
    trim: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
});

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dep: {
    type: String,
    trim: true,
  },
  about: String,
  workshopImg: String,
  structure: String,
  contact: String,
  entryFee: String,
  instructorName: String,
  instructorSpecifications: String,
  instructorImage: String,
  regStudents: {
    type: [regStudentsSchema],
    default: [],
  },
});

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;
