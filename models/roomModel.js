import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNo: String,
    people: {
      type: [String],
      default: [],
    },
    gender: String,
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
