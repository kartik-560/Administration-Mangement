"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Added Redux import
import { createDepartment } from "@/services/department.api"; // Assuming you are using the API file
import {
  Building2,
  School,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AddDepartmentPage() {
  const router = useRouter();

  // Access the user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Dynamically check if the logged-in user is a SuperAdmin (roleId === 1)
  const isSuperAdmin = user?.roleId === 1;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    collegeId: "",
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        ...(formData.collegeId && { collegeId: formData.collegeId }),
      };

      // Call the externalized API function
      await createDepartment(payload);

      setSuccess(true);
      setFormData({ name: "", collegeId: "" });

      setTimeout(() => {
        router.push("/departments");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/50 rounded-3xl p-8 border border-white">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Building2 size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Add New Department
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Create a new department for the college
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-600">
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              Department created successfully! Redirecting...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Department Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Computer Science Engineering"
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Conditional College ID Input for SuperAdmin */}
          {isSuperAdmin && (
            <div className="space-y-2">
              <label
                htmlFor="collegeId"
                className="block text-sm font-semibold text-gray-700"
              >
                College ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <School size={18} />
                </div>
                <input
                  type="number"
                  id="collegeId"
                  name="collegeId"
                  value={formData.collegeId}
                  onChange={handleChange}
                  placeholder="Enter College ID"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required={isSuperAdmin}
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                Required for SuperAdmin role.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Department"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}