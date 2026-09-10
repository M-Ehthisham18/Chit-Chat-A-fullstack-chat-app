import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestId: {
      type: String,
      unique: true,
      sparse: true,
    },
    guestPinHash: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
