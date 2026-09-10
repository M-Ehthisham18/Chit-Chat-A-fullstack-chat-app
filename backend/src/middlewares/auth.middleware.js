import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { generateGuestId } from "../lib/guestUtils.js";

dotenv.config(); // Ensure environment variables are loaded

const protectRoute = async (req, res, next) => {
  try {
    //console.log("Cookies Received:", req.cookies); // ✅ Debug: Log received cookies
    const token = req.cookies?.jwt; // Ensure token is retrieved safely

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided." });
    }

    //console.log("Token Found:", token); // ✅ Debug: Log the token

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded Token:", decoded); // ✅ Debug: Log decoded data

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Fix legacy guests: if isGuest is true but guestId is missing, generate one and save it.
    if (user.isGuest && !user.guestId) {
      let guestId;
      let isUnique = false;
      while (!isUnique) {
        guestId = generateGuestId();
        const existing = await User.findOne({ guestId });
        if (!existing) isUnique = true;
      }
      user.guestId = guestId;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export default protectRoute;
