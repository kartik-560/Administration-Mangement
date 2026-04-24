'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Loader, BookOpen, Briefcase, CheckCircle2, Circle } from 'lucide-react';
import { completeProfileApi } from '@/features/auth/signup/signup.api';
import { getDepartments } from '@/features/admin/department/department.api';
import { setUser } from '@/features/store/authSlice'; 

export default function FacultyOnboardingForm({ user }) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    departmentId: '',
    responsibilities: ['TEACHING'], 
  });

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);
  const [error, setError] = useState('');

  // The available sub-roles defined in your schema
  const availableResponsibilities = [
    { id: 'TEACHING', label: 'Teaching Faculty' },
    { id: 'HOD', label: 'Head of Department' },
    { id: 'EXAM_INCHARGE', label: 'Examination In-charge' },
    { id: 'TIMETABLE_INCHARGE', label: 'Timetable Co-ordinator' }
  ];

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

  const toggleResponsibility = (respId) => {
    setFormData(prev => {
      const currentResps = prev.responsibilities;
      if (currentResps.includes(respId)) {
        // Prevent removing 'TEACHING' if it's the only one left
        if (currentResps.length === 1) return prev; 
        return { ...prev, responsibilities: currentResps.filter(id => id !== respId) };
      } else {
        return { ...prev, responsibilities: [...currentResps, respId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.departmentId) return setError("Please select your department.");
    if (formData.responsibilities.length === 0) return setError("Select at least one responsibility.");

    setIsLoading(true);

    try {
      // Just pass the profileData. The token is handled inside completeProfileApi.
      const payload = {
        departmentId: formData.departmentId,
        responsibilities: formData.responsibilities
      };

      // 1. Call the real API
      const response = await completeProfileApi(payload);

      if (response.success) {
        // 2. Update Redux with the new user object (which now has registrationStep: "COMPLETED")
        dispatch(setUser(response.user));
        
        // 3. Send them to the Faculty Dashboard!
        router.push('/faculty/dashboard');
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

      {/* Professional Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
          <Briefcase className="text-primary" />
          Professional Profile
        </h3>

        {/* Department Dropdown */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Assigned Department</label>
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

        {/* Responsibilities Multi-Select Grid */}
        <div className="space-y-2 pt-2">
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Additional Responsibilities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableResponsibilities.map((resp) => {
              const isSelected = formData.responsibilities.includes(resp.id);
              return (
                <div 
                  key={resp.id}
                  onClick={() => toggleResponsibility(resp.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.98]
                    ${isSelected 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'bg-background/50 border-border/50 hover:border-primary/50'}`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="text-primary text-xl flex-shrink-0" />
                  ) : (
                    <Circle className="text-muted-foreground text-xl flex-shrink-0" />
                  )}
                  <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {resp.label}
                  </span>
                </div>
              );
            })}
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