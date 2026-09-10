import { X, Ban, UserCheck } from "lucide-react";
import { useAuthStore } from "../store/useAuthSotre";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, blockUser, unblockUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const handleBlockToggle = async () => {
    if (selectedUser.blockedByMe) {
      await unblockUser(selectedUser._id);
    } else {
      await blockUser(selectedUser._id);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullname} />
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-medium">{selectedUser.fullname}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>

            {/* Block/Unblock Action */}
            {!selectedUser.blockedMe && (
              <button
                onClick={handleBlockToggle}
                className={`btn btn-xs btn-ghost gap-1 ${
                  selectedUser.blockedByMe ? "text-success" : "text-error"
                }`}
                title={selectedUser.blockedByMe ? "Unblock User" : "Block User"}
              >
                {selectedUser.blockedByMe ? (
                  <>
                    <UserCheck size={14} />
                    Unblock
                  </>
                ) : (
                  <>
                    <Ban size={14} />
                    Block
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;