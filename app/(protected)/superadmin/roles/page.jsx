'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, X, Shield, Save, Globe, Building } from 'lucide-react';
import { getRoles, updateRole } from '@/features/superadmin/role/role.api';
import { getColleges } from '@/features/superadmin/college/college.api'; // ✅ API Imported

export default function RolesListPage() {
    const router = useRouter();
    
    // Roles State
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // College State for the Dropdown
    const [colleges, setColleges] = useState([]);
    const [isLoadingColleges, setIsLoadingColleges] = useState(true);
    
    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [editData, setEditData] = useState({ id: '', name: '', description: '', collegeId: '' });

    const fetchData = async () => {
        setIsLoading(true);
        setIsLoadingColleges(true);
        setError(null);
        
        try {
            // 1. Fetch Roles
            const rolesData = await getRoles();
            setRoles(rolesData);

            // 2. Fetch Colleges (Using your exact logic)
            const collegeResponse = await getColleges();
            
            if (Array.isArray(collegeResponse)) {
                setColleges(collegeResponse); 
            } else if (collegeResponse && collegeResponse.data && Array.isArray(collegeResponse.data)) {
                setColleges(collegeResponse.data);
            } else {
                setColleges([]); 
            }

        } catch (err) {
            console.error("Failed to load data", err);
            setError(err.message || "Failed to load data.");
            setColleges([]); // Prevent crash on error
        } finally {
            setIsLoading(false);
            setIsLoadingColleges(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openEditModal = (role) => {
        setEditData({ 
            id: role.id, 
            name: role.name, 
            description: role.description || '',
            collegeId: role.collegeId || '' 
        });
        setFormError(null);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            await updateRole(editData.id, { 
                name: editData.name, 
                description: editData.description,
                collegeId: editData.collegeId ? editData.collegeId : null 
            });
            
            // Refresh table
            await fetchData(); 
            setIsEditModalOpen(false); 
        } catch (err) {
            setFormError(err.message || "Failed to update role.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground font-headline tracking-tight flex items-center gap-3">
                        <Shield className="text-primary" /> Role Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 font-body">
                        Define and manage access levels across the system.
                    </p>
                </div>
                <button 
                    onClick={() => router.push('/superadmin/roles/add')} 
                    className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0.5 transition-all w-fit"
                >
                     Create Role
                </button>
            </header>

            {/* Roles Table Container */}
            <section className="bg-surface rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium animate-pulse">Loading roles...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-sm text-center">
                        <span className="font-bold">Error:</span> {error}
                        <button onClick={fetchData} className="ml-4 underline font-bold">Try Again</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-muted-foreground text-[10px] uppercase tracking-widest font-black">
                                    <th className="pb-4 px-4 font-black">Role ID</th>
                                    <th className="pb-4 px-4 font-black">Role Name</th>
                                    <th className="pb-4 px-4 font-black">Description</th>
                                    <th className="pb-4 px-4 font-black">Scope</th>
                                    <th className="pb-4 px-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-foreground">
                                {roles.map((role) => (
                                    <tr key={role.id} className="border-b border-border/10 hover:bg-muted/10 transition-colors group">
                                        <td className="py-4 px-4 font-bold text-primary">#{role.id}</td>
                                        <td className="py-4 px-4 font-bold">{role.name}</td>
                                        <td className="py-4 px-4 text-muted-foreground">{role.description || '-'}</td>
                                        <td className="py-4 px-4">
                                            {role.collegeId === null ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                                                    <Globe size={12} /> Global
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-green-50 text-green-600 border border-green-200">
                                                    College Specific
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button 
                                                onClick={() => openEditModal(role)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-transparent hover:border-primary/20"
                                                title="Edit Role"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {roles.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-muted-foreground font-medium">
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface w-full max-w-md rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border/50">
                            <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                                <Pencil className="text-primary" /> Edit Role
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                            
                            {formError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Role ID</label>
                                <input
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm opacity-60 cursor-not-allowed outline-none"
                                    type="number"
                                    value={editData.id}
                                    disabled
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Role Name</label>
                                <input
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    required
                                />
                            </div>

                            {/* College Dropdown for Editing Scope */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <Building size={12}/> Assign to College 
                                </label>
                                <select
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={editData.collegeId}
                                    onChange={(e) => setEditData({...editData, collegeId: e.target.value})}
                                    disabled={isLoadingColleges}
                                >
                                    <option value="">🌐 Global Role</option>
                                    {colleges.map((college) => (
                                        <option key={college.id || college._id} value={college.id || college._id}>
                                            🏢 {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[100px] resize-none"
                                    value={editData.description}
                                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-border/50">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-muted/30 hover:bg-muted/50 text-foreground rounded-xl font-bold transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-70">
                                    {isSubmitting ? 'Saving...' : <><Save size={18}/> Update Role</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}