import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useAuthStore } from "./useAuthSotre.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  inMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if (error.response) {
        console.log("Server response:", error.response.data);
        toast.error(error.response.data.message || "Failed to fetch users");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  blockUser: async (userId) => {
    try {
      await axiosInstance.post(`/blocks/block/${userId}`);
      toast.success("User blocked");

      // Update local users list to reflect block state
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, blockedByMe: true, blockedMe: false } : u
        ),
      }));

      // Update selected user if it's the one being blocked
      set((state) => ({
        selectedUser: state.selectedUser?._id === userId
          ? { ...state.selectedUser, blockedByMe: true, blockedMe: false }
          : state.selectedUser,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.post(`/blocks/unblock/${userId}`);
      toast.success("User unblocked");

      // Update local users list to reflect unblock state
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, blockedByMe: false, blockedMe: false } : u
        ),
      }));

      // Update selected user if it's the one being unblocked
      set((state) => ({
        selectedUser: state.selectedUser?._id === userId
          ? { ...state.selectedUser, blockedByMe: false, blockedMe: false }
          : state.selectedUser,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  },

  getMessages: async (userId) => {
    set({ inMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ inMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
  
      // Ensure new message is added only once
      set({ messages: [...messages, res.data] });
  
    } catch (error) {
      toast.error(
        error.response.data.message || "Error in sendMessage: " + error
      );
    }
  },
  
  subscribeToMessages: () => {
  const { selectedUser, messages } = get();
  if (!selectedUser) return;
  const socket = useAuthStore.getState().socket;

  socket.on("newMessage", (newMessage) => {
    const existingMessage = get().messages.find(
      (msg) => msg._id === newMessage._id
    );

    // Add message ONLY if it does not already exist
    if (!existingMessage) {
      set({ messages: [...get().messages, newMessage] });
    }
  });
},
  

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
