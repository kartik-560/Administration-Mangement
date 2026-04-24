'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Loader, GraduationCap, Calendar, BookOpen } from 'lucide-react';

// Import your API and Redux actions
import { completeProfileApi } from '@/features/auth/signup/signup.api';
import { getDepartments } from '@/features/admin/department/department.api';
import { setUser } from '@/features/store/authSlice';

export default function StudentOnboardingForm({ user }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    departmentId: '', 
    batch: new Date().getFullYear(), // Default to current year
    semester: 1,
  });

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [error, setError] = useState('');

  // Fetch departments belonging to this user's college
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsFetchingOptions(true);
        const response = await getDepartments(user.collegeId);
        // Ensure we extract the array if your API wraps it in { data: [...] }
        setDepartments(response.data || response || []);
      } catch (err) {
        setError("Could not load departments. Please refresh.");
      } finally {
        setIsFetchingOptions(false);
      }
    };

    if (user?.collegeId) fetchDepartments();
  }, [user?.collegeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.departmentId) return setError("Please select your department.");
    if (!formData.batch) return setError("Please enter your batch year.");

    setIsLoading(true);

    try {
      // Just pass the profileData. The token is handled inside completeProfileApi.
      const payload = {
        departmentId: formData.departmentId,
        batch: parseInt(formData.batch, 10),
        semester: parseInt(formData.semester, 10)
      };

      // 1. Call the real API
      const response = await completeProfileApi(payload);

      if (response.success) {
        // 2. Update Redux with the new user object (which now has registrationStep: "COMPLETED")
        dispatch(setUser(response.user));
        
        // 3. Send them to the Student Dashboard!
        router.push('/student/dashboard');
      }
      
    } catch (err) {
      setError(err.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-600 px-4 py-3 rounded-xl border border-red-500/10 text-xs font-bold text-center italic">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
          <BookOpen className="text-primary" />
          Academic Details
        </h3>

        {/* Department Dropdown */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Department</label>
          <div className="relative">
            <select 
              name="departmentId" 
              value={formData.departmentId} 
              onChange={handleChange} 
              disabled={isFetchingOptions}
              className="w-full pl-10 pr-4 py-2.5 bg-background/50 rounded-xl border border-border/50 appearance-none text-sm outline-none focus:border-primary disabled:opacity-50 transition-colors"
            >
              <option value="">{isFetchingOptions ? "Loading..." : "Select Department"}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-lg" />
          </div>
        </div>

        {/* Batch & Semester Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Batch (Year)</label>
            <div className="relative">
              <input 
                name="batch" 
                value={formData.batch} 
                onChange={handleChange}
                type="number"
                min="2000"
                max="2100"
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 rounded-xl border border-border/50 outline-none focus:border-primary text-sm transition-colors" 
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Semester</label>
            <div className="relative">
              <select 
                name="semester" 
                value={formData.semester} 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 rounded-xl border border-border/50 appearance-none text-sm outline-none focus:border-primary transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isLoading || isFetchingOptions}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold text-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98]" 
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin text-xl" />
              <span>Finalizing Profile...</span>
            </>
          ) : (
            'Complete Setup & Enter Dashboard'
          )}
        </button>
      </div>
    </form>
  );
}