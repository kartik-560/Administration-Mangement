"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "../../../features/store/authSlice";
import {
  LuGraduationCap,
  LuMail,
  LuLock,
  LuLoader,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";

import { loginUserApi } from "@/features/auth/login/login.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUserApi(email, password);

      if (response.success) {
        // 1. Save the JWT token
        localStorage.setItem("token", response.token);

        // 2. THE KEY ADDITION: Save the user object to localStorage
        // This prevents the AuthChecker from redirecting you back to login
        // because it allows the app to "remember" you even if Redux resets.
        const userPayload = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`,
          email: response.user.email,
          role: response.user.role,
          roleId: response.user.roleId,
          collegeId: response.user.collegeId,
        };

        localStorage.setItem("user", JSON.stringify(userPayload));

        // 3. Update Redux store
        dispatch(setUser(userPayload));

        // 4. Redirect to the dashboard
        // Note: Using router.push is fine here since we are moving forward
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
              <LuGraduationCap className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to access The Ethereal Academic portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuMail className="text-slate-400 text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="admin@university.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                {/* Left Icon (Lock) */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuLock className="text-slate-400 text-lg" />
                </div>

                {/* Input Field */}
                <input
                  // Toggle between "text" and "password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Note: Increased pr-4 to pr-12 to make room for the right-side button
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="••••••••"
                  required
                />

                {/* Right Icon (View/Hide Button) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <LuEyeOff className="text-lg" />
                  ) : (
                    <LuEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LuLoader className="animate-spin text-xl" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
