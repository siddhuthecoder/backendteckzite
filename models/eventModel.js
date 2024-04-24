import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dep: { type: String, required: true },
  img: { type: String },
  desc: { type: String },
  structure: { type: String },
  rules: { type: [String], default: [] },
  timeline: String,
  teamSize: { type: Number, default: 1 },
  contact_info: { type: String },
  prizeMoney: { type: String },
  registerdStudents: [
    {
      type: [{ type: String }],
      default: [],
    },
  ],
});

const Event = mongoose.model("Event", EventSchema);
export default Event;
