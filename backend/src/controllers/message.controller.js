import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Block from "../models/block.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId , io } from "../lib/socket.js";

// getUsersForSidebar route function
const getUsersForSidebar = async (req, res) => {
  try {

    const loggedInUserId = req.user?._id;
    if (!loggedInUserId) {
      console.error("No user ID found in request");
      return res.status(400).json({ message: "User ID is required" });
    }

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Fetch all blocks involving the logged-in user to avoid N+1 queries
    const blocks = await Block.find({
      $or: [
        { blockerId: loggedInUserId },
        { blockedId: loggedInUserId },
      ],
    });

    const blockMap = new Map();
    blocks.forEach(block => {
      blockMap.set(
        block.blockerId.toString() === loggedInUserId.toString()
          ? block.blockedId.toString()
          : block.blockerId.toString(),
        block
      );
    });

    const usersWithBlockState = users.map((user) => {
      const block = blockMap.get(user._id.toString());
      return {
        ...user.toObject(),
        blockedByMe: block && block.blockerId.toString() === loggedInUserId.toString(),
        blockedMe: block && block.blockedId.toString() === loggedInUserId.toString(),
      };
    });

    res.status(200).json(usersWithBlockState);
  } catch (error) {
    console.error(`getUsersForSidebar error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// getMessages route function
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log(`getmessages error : ${error}`);
    return res.status(500).json({ message: "internal error." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Block Authorization: check if either user has blocked the other
    const block = await Block.findOne({
      $or: [
        { blockerId: senderId, blockedId: receiverId },
        { blockerId: receiverId, blockedId: senderId },
      ],
    });

    if (block) {
      return res.status(403).json({ message: "You cannot send messages to this user." });
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUsersForSidebar, getMessages, sendMessage };
