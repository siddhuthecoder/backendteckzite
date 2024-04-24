import mongoose from "mongoose";

const CountSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CountSchema);

export const getNextSequenceValue = async (sequenceName) => {
  try {
    // Check if the sequence document exists, if not, create it
    let sequenceDocument = await Counter.findById(sequenceName);
    if (!sequenceDocument) {
      // Create the sequence document if it doesn't exist
      sequenceDocument = new Counter({ _id: sequenceName });
      await sequenceDocument.save();
    }

    // Increment and return the sequence value
    sequenceDocument.sequence_value++;
    await sequenceDocument.save();
    return sequenceDocument.sequence_value;
  } catch (error) {
    throw new Error(`Error getting next sequence value: ${error.message}`);
  }
};
