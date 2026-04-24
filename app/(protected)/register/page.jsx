'use client'

import React, { useState, useEffect } from 'react';
import { 
    Info, ChevronDown, School, ShieldCheck, 
    Activity, BarChart3, UserPlus, Loader, CircleCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { registerUserApi, getRolesApi, getCollegesApi } from "@/features/register/register.api";

export default function Register() {
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', roleId: '', collegeId: '', sendEmail: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roles, setRoles] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isFetchingOptions, setIsFetchingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsFetchingOptions(true);
        const rolesData = await getRolesApi();
        setRoles(rolesData.data || rolesData || []);

        if (Number(currentUser?.roleId) === 1) {
          const collegesData = await getCollegesApi();
          setColleges(collegesData.data || collegesData || []);
        }
      } catch (err) {
        setError("Could not load form data. Please refresh.");
      } finally {
        setIsFetchingOptions(false);
      }
    };
    fetchOptions();
  }, [currentUser?.roleId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const finalDataToSubmit = {
        ...formData,
        collegeId: Number(currentUser?.roleId) === 1 ? formData.collegeId : currentUser?.collegeId
    };

    try {
      const response = await registerUserApi(finalDataToSubmit);
      if (response.success) {
        setSuccess("User created successfully!");
        setFormData({ firstName: '', lastName: '', email: '', roleId: '', collegeId: '', sendEmail: true });
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // min-h-[calc(100vh-4rem)] ensures it accounts for a standard navbar height
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] py-4 px-4 overflow-hidden animate-in fade-in duration-700">
      
      <div className="w-full max-w-[550px]">
        {/* --- Left-Aligned Header --- */}
        <header className="mb-6 text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 shadow-sm">
                <UserPlus className="text-2xl" />
            </div>
            <h1 className="text-3xl font-black font-headline text-foreground tracking-tight">
            Create New User
            </h1>
            <p className="text-muted-foreground font-body text-sm">
            Provision a secure account for college personnel
            </p>
        </header>

        {/* --- Tighter Form Card --- */}
        <div className="bg-surface rounded-[1.5rem] shadow-xl border border-border/50 overflow-hidden">
            
            {/* Conditional Alerts */}
            {error && (
                <div className="bg-red-500/10 text-red-600 px-6 py-3 border-b border-red-500/10 text-xs font-bold text-center italic">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-500/10 text-emerald-600 px-6 py-3 border-b border-emerald-500/10 text-xs font-bold text-center">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-7 space-y-4">
            
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">First Name</label>
                <input 
                    name="firstName" value={formData.firstName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-background/50 rounded-xl border border-border/50 focus:border-primary outline-none text-sm" 
                    placeholder="Julian" type="text" 
                />
                </div>
                <div className="space-y-1">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Last Name</label>
                <input 
                    name="lastName" value={formData.lastName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-background/50 rounded-xl border border-border/50 focus:border-primary outline-none text-sm" 
                    placeholder="Vance" type="text" 
                />
                </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
                <input 
                name="email" value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-background/50 rounded-xl border border-border/50 focus:border-primary outline-none text-sm" 
                placeholder="julian.vance@university.edu" type="email" 
                />
            </div>

            {/* Role & Institution Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Role</label>
                    <div className="relative">
                        <select 
                        name="roleId" value={formData.roleId} onChange={handleChange} disabled={isFetchingOptions}
                        className="w-full pl-4 pr-10 py-2.5 bg-background/50 rounded-xl border border-border/50 appearance-none text-sm disabled:opacity-50"
                        >
                            <option value="">{isFetchingOptions ? "Loading..." : "Select Role"}</option>
                            {roles.filter(r => r.id >= (Number(currentUser?.roleId) || 0)).map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                {Number(currentUser?.roleId) === 1 && (
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider ml-1">Institution</label>
                        <div className="relative">
                            <select 
                            name="collegeId" value={formData.collegeId} onChange={handleChange} disabled={isFetchingOptions}
                            className="w-full pl-4 pr-10 py-2.5 bg-background/50 rounded-xl border border-border/50 appearance-none text-sm"
                            >
                                <option value="">Select College</option>
                                {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <School className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm" />
                        </div>
                    </div>
                )}
            </div>

            {/* Compact Switch */}
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded-xl border border-border/20">
                <span className="text-xs font-bold text-foreground">Email Invitation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="sendEmail" checked={formData.sendEmail} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-muted-foreground/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
                <button 
                type="submit" disabled={isLoading || isFetchingOptions}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold text-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50" 
                >
                {isLoading ? <Loader className="animate-spin" /> : 'Create Account'}
                </button>
            </div>
            </form>
        </div>

        {/* --- Minimalist Footer --- */}
        <footer className="mt-6 flex justify-center gap-8 opacity-30 grayscale scale-90">
            <div className="flex items-center gap-2">
            <ShieldCheck className="text-xl" />
            <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex items-center gap-2">
            <Activity className="text-xl" />
            <span className="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
            </div>
        </footer>
      </div>
    </div>
  );
}