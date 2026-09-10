import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthSotre";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Key } from "lucide-react";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import GuestCredentialsModal from "../components/GuestCredentialsModal.jsx";

const Loginpage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isGuestLoginMode, setIsGuestLoginMode] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestCredentials, setGuestCredentials] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    guestId: "",
    guestPin: "",
  });
  const { login, guestLogin, guestReLogin, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGuestLoginMode) {
      guestReLogin({
        guestId: formData.guestId,
        password: formData.password,
      });
    } else {
      login(formData);
    }
  };

  const onContinueAsGuest = async () => {
    const password = prompt("Please choose a password for your guest account (min 6 chars):");
    if (!password || password.length < 6) {
      toast.error("A password of at least 6 characters is required for guest accounts.");
      return;
    }
    const confirmPassword = prompt("Confirm your password:");
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const user = await guestLogin({ password });
      if (user) {
        setGuestCredentials(user);
        setShowGuestModal(true);
      }
    } catch {
      // Error handled by store toast
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Guest Credentials Modal */}
      {showGuestModal && (
        <GuestCredentialsModal
          credentials={guestCredentials}
          onClose={() => setShowGuestModal(false)}
        />
      )}

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {isGuestLoginMode ? "Guest Return" : "Welcome Back"}
              </h1>
              <p className="text-base-content/60">
                {isGuestLoginMode
                  ? "Enter your Guest ID and password to resume"
                  : "Sign in to your account"}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isGuestLoginMode ? (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Guest ID</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10 uppercase`}
                      placeholder="ABC12D3"
                      value={formData.guestId}
                      onChange={(e) =>
                        setFormData({ ...formData, guestId: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="password"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                isGuestLoginMode ? "Guest Login" : "Sign in"
              )}
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="btn btn-outline btn-secondary w-full"
              disabled={isLoggingIn}
              onClick={onContinueAsGuest}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                "Continue as Guest"
              )}
            </button>

            <div className="text-center">
              {isGuestLoginMode ? (
                <p className="text-base-content/60">
                  No Guest ID?{" "}
                  <button
                    onClick={() => setIsGuestLoginMode(false)}
                    className="link link-primary"
                  >
                    Back to Login
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-base-content/60">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="link link-primary">
                      Create account
                    </Link>
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setIsGuestLoginMode(true)}
                      className="text-sm link link-hover text-base-content/60"
                    >
                      Already have a Guest ID? Log in here
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={isGuestLoginMode ? "Welcome Back, Guest!" : "Welcome back!"}
        subtitle={
          isGuestLoginMode
            ? "Use your unique Guest ID and PIN to resume your conversations."
            : "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};

export default Loginpage;
