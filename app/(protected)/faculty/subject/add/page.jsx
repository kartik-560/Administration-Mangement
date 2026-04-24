"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Loader2, ArrowLeft, BookOpen } from "lucide-react";
import { createSubjectApi } from "@/features/faculty/subject.api";

export default function AddSubjectPage() {
  const router = useRouter();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    subjectCode: "", // Changed to match Prisma schema
    credits: "",     // Added to match Prisma schema
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field as user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Subject name is required";
    if (!form.subjectCode.trim()) newErrors.subjectCode = "Subject code is required";
    if (!form.credits || isNaN(form.credits) || Number(form.credits) <= 0) {
      newErrors.credits = "Please enter a valid number of credits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    // Grab the department ID safely based on your schema logic
    const currentDeptId = currentUser?.departmentId || currentUser?.facultyProfile?.departmentId;

    const payload = {
      name: form.name,
      subjectCode: form.subjectCode,
      credits: Number(form.credits), // Convert to Int for Prisma
      collegeId: currentUser?.collegeId,
      departmentId: currentDeptId
    };

    try {
      setIsSubmitting(true);
      await createSubjectApi(payload);
      
      // Navigate back to the list page on success
      router.push("/faculty/subject"); 
    } catch (error) {
      console.error(error);
      setApiError(error.message || "Failed to create subject. The code might already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-body min-h-screen text-gray-900 dark:text-gray-100 p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Back Button */}
        <Link href="/subjects" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#4c6ef5] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </Link>

        <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1d27] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#4c6ef5]/10 text-[#4c6ef5] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight m-0 text-gray-900 dark:text-white">Add New Subject</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 m-0">Register a new academic subject to your department.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Global API Error */}
            {apiError && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-sm font-semibold text-red-600 dark:text-red-400">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Subject Name */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subject Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Database Management Systems"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 transition-all`}
                />
                {errors.name && <p className="text-xs font-bold text-red-500 mt-1.5">{errors.name}</p>}
              </div>

              {/* Subject Code */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subject Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="subjectCode"
                  value={form.subjectCode}
                  onChange={handleChange}
                  placeholder="e.g. CS401"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.subjectCode ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-sm uppercase font-mono outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 transition-all`}
                />
                {errors.subjectCode && <p className="text-xs font-bold text-red-500 mt-1.5">{errors.subjectCode}</p>}
              </div>

              {/* Credits */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Credits <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="credits"
                  value={form.credits}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="1"
                  max="10"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border ${errors.credits ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 transition-all`}
                />
                {errors.credits && <p className="text-xs font-bold text-red-500 mt-1.5">{errors.credits}</p>}
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <Link href="/subjects">
                <button type="button" className="px-5 py-2.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 transition-colors">
                  Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-all flex items-center gap-2 bg-[#4c6ef5] hover:bg-[#3b5bdb] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Subject"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}