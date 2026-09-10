import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import Block from "../models/block.model.js";

const router = express.Router();

// Block a user
router.post("/block/:id", protectRoute, async (req, res) => {
  try {
    const { id: blockedId } = req.params;
    const blockerId = req.user._id;

    if (blockerId.toString() === blockedId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const existingBlock = await Block.findOne({ blockerId, blockedId });
    if (existingBlock) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    const newBlock = new Block({ blockerId, blockedId });
    await newBlock.save();

    res.status(201).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unblock a user
router.post("/unblock/:id", protectRoute, async (req, res) => {
  try {
    const { id: blockedId } = req.params;
    const blockerId = req.user._id;

    const block = await Block.findOne({ blockerId, blockedId });
    if (!block) {
      return res.status(404).json({ message: "Block relationship not found" });
    }

    await Block.deleteOne({ _id: block._id });

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
