import React from "react";
import { Lock, Copy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GuestCredentialsModal = ({ credentials, onClose }) => {
  const navigate = useNavigate();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center border-b border-base-content/10 bg-primary/5">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Guest Account Created!</h2>
          <p className="text-base-content/60 mt-2">
            Save these credentials to return to your chat later.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Your Guest ID</span>
              </label>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={credentials.guestId}
                  className="input input-bordered w-full font-mono text-lg font-bold bg-base-200"
                />
                <button
                  onClick={() => copyToClipboard(credentials.guestId)}
                  className="btn btn-square btn-ghost"
                  title="Copy Guest ID"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Your Password</span>
              </label>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="Set by you"
                  className="input input-bordered w-full font-mono text-lg font-bold bg-base-200"
                />
                <div className="btn btn-square btn-ghost opacity-50 cursor-not-allowed">
                  <Copy className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl">
            <p className="text-sm text-warning-foreground text-center font-medium">
              ⚠️ Warning: We do not store your password in plaintext. If you lose these credentials, you will lose access to this guest account.
            </p>
          </div>
        </div>

        <div className="p-6 bg-base-200/50 flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            Continue to Chat <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="btn btn-ghost w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestCredentialsModal;
