import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    blockerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user cannot block the same user multiple times
blockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

const Block = mongoose.model("Block", blockSchema);

export default Block;
