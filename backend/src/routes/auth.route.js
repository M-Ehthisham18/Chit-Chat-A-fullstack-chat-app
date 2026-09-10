import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  deleteAccount,
  guestSignup,
  guestLogin,
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/guest", guestSignup);
router.post("/guest-login", authLimiter, guestLogin);
router.post("/login", authLimiter, login);

router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
router.post("/delete-account", protectRoute, deleteAccount);

export default router;
