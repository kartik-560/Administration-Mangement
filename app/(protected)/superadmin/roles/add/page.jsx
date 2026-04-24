'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Save, Building } from 'lucide-react';
import { createRole } from '@/features/superadmin/role/role.api'; 

import { getColleges } from '@/features/superadmin/college/college.api'; 

export default function AddRolePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    
    // 1. State for Colleges Dropdown
    const [colleges, setColleges] = useState([]);
    const [isLoadingColleges, setIsLoadingColleges] = useState(true);
    
    // 2. Added collegeId to formData
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        collegeId: '' 
    });

    // 3. Fetch colleges on page load
 // 3. Fetch colleges on page load
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await getColleges();
                
                // --- THE FIX IS HERE ---
                // Check if your API returns the array directly, OR if it's nested inside 'data'
                if (Array.isArray(response)) {
                    setColleges(response); 
                } else if (response && response.data && Array.isArray(response.data)) {
                    setColleges(response.data); // Extracts the array from { success: true, data: [...] }
                } else {
                    // Fallback to empty array if something weird comes back
                    setColleges([]); 
                }

            } catch (error) {
                console.error("Failed to load colleges", error);
                setColleges([]); // Prevent crash on error by setting empty array
            } finally {
                setIsLoadingColleges(false);
            }
        };

        fetchColleges();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            await createRole({
                id: parseInt(formData.id, 10),
                name: formData.name,
                description: formData.description,
                // 4. Send collegeId if selected, otherwise send null for Global Role
                collegeId: formData.collegeId ? formData.collegeId : null 
            });
            
            router.push('/superadmin/roles');
            
        } catch (err) {
            setFormError(err.message || "Failed to create role. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            <header className="space-y-4">
                <button 
                    onClick={() => router.push('/superadmin/roles')}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft size={16} /> Back to Roles
                </button>
                
                <div>
                    <h1 className="text-3xl font-black text-foreground font-headline tracking-tight flex items-center gap-3">
                        <Shield className="text-primary" /> Create New Role
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 font-body">
                        Fill out the details below to add a new role to the system.
                    </p>
                </div>
            </header>

            <section className="bg-surface rounded-[2rem] p-6 md:p-10 border border-border/50 shadow-sm">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    
                    {formError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-200 text-sm flex items-center gap-3">
                            <span className="font-bold">Error:</span> {formError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                Role ID (Number) <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                type="number"
                                min="1"
                                placeholder="e.g. 5"
                                value={formData.id}
                                onChange={(e) => setFormData({...formData, id: e.target.value})}
                                required
                            />
                            <p className="text-[10px] text-muted-foreground ml-1">Must be unique (e.g., 2 for Principal, 3 for HOD).</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                type="text"
                                placeholder="e.g. Accountant"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    {/* 5. The New College Dropdown */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                            <Building size={12}/> Assign to College 
                            <span className="text-primary/60 lowercase ml-1">(Optional - Leave blank for Global Role)</span>
                        </label>
                        <select
                            className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            value={formData.collegeId}
                            onChange={(e) => setFormData({...formData, collegeId: e.target.value})}
                            disabled={isLoadingColleges}
                        >
                            <option value="">🌐 Global Role (Available to all colleges)</option>
                            {isLoadingColleges ? (
                                <option disabled>Loading colleges...</option>
                            ) : (
                                colleges.map((college) => (
                                    <option key={college.id || college._id} value={college.id || college._id}>
                                        🏢 {college.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                            Role Description
                        </label>
                        <textarea
                            className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[120px] resize-none"
                            placeholder="Briefly describe the responsibilities and access level of this role..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/50 flex flex-col sm:flex-row justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={() => router.push('/admin/roles')}
                            className="px-8 py-4 bg-muted/30 hover:bg-muted/50 text-foreground rounded-2xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Creating Role...</span>
                            ) : (
                                <><Save size={18}/> Publish Role</>
                            )}
                        </button>
                    </div>

                </form>
            </section>
        </main>
    );
}