import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isAccountDeleting : false,
  isCheckingAuth: true,
  onlineUsers : [],
  socket : null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      const isUnauthorized = error.response?.status === 401;
      if (!isUnauthorized) {
        console.log("Unexpected error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Invalid Credentials (Please try again)."
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  guestLogin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/guest", data);
      set({ authUser: res.data });
      get().connectSocket();
      return res.data; // Return user data for the modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Guest entry failed. Please try again."
      );
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  guestReLogin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/guest-login", data);
      set({ authUser: res.data });
      toast.success("Welcome back, Guest!");
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Guest login failed. Invalid credentials."
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Logout error:", error); // Debugging
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("error in updating profile.");
      toast.error(error?.response?.data?.message || "failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteAccount: async (password) => {
    set({ isAccountDeleting: true });
    
    try {
      await axiosInstance.post(
        "/auth/delete-account",
        { password }, // Send as an object
        { withCredentials: true } // Ensure credentials (JWT cookies) are sent
      );
      
      set({ authUser: null });
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error in deleting account:", error);
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      set({ isAccountDeleting: false });
    }
  },  
 
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: socket });
    socket.connect();
  },
  disconnectSocket : () => {
    if(get().socket?.connected) get().socket.disconnect();
  }
}));
