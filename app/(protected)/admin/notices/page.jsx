'use client'

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Globe, GraduationCap, Users, LayoutDashboard, Pencil, X, Save, ArrowLeft } from 'lucide-react';
import { getNotices, updateNotice } from '@/features/admin/dashboard/dashboard.api' // Ensure updateNotice is imported
import { useRouter } from 'next/navigation';
export default function NoticesPage() {
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const router = useRouter();
    // --- NEW EDIT MODAL STATES ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const fetchNotices = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            
            if (!user || !user.collegeId) {
                throw new Error("User authentication data missing. Cannot load notices.");
            }

            const fetchedNotices = await getNotices(user.collegeId, activeFilter);
            setNotices(fetchedNotices);
        } catch (err) {
            setError(err.message || "Failed to load notices.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [activeFilter]);

    // --- MODAL HANDLERS ---
    const openEditModal = (notice) => {
        // Create a copy of the notice to edit so we don't mutate the list directly
        setEditingNotice({ ...notice });
        setUpdateError(null);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingNotice(null);
        setUpdateError(null);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateError(null);

        try {
            // We only send the fields the backend expects for an update
            const payload = {
                subject: editingNotice.subject,
                body: editingNotice.body,
                targetAudience: editingNotice.targetAudience
            };

            // Assuming your notice object has an _id or id property
            const noticeId = editingNotice._id || editingNotice.id;
            
            await updateNotice(noticeId, payload);
            
            // Refresh notices to show the updated data
            await fetchNotices(); 
            
            // Close modal on success
            closeEditModal();
        } catch (error) {
            setUpdateError(error.message || "Failed to update the notice.");
        } finally {
            setIsUpdating(false);
        }
    };

    // --- HELPERS ---
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getAudienceBadge = (audience) => {
        switch (audience) {
            case 'FACULTY':
                return <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-lg text-[10px] font-bold uppercase"><GraduationCap size={12}/> Faculty</span>;
            case 'STUDENTS':
                return <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg text-[10px] font-bold uppercase"><Users size={12}/> Students</span>;
            default:
                return <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase"><Globe size={12}/> All</span>;
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6 relative">
            
            {/* Page Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/70 transition"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <div>
                <h1 className="text-3xl font-black text-foreground font-headline tracking-tight">
                    Campus Notices
                </h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    View and manage recent announcements
                </p>
            </div>

        </header>

            {/* Main Content Area */}
            <section className="bg-surface rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-sm transition-all duration-500">
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                            <Bell className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground font-headline">Notice Board</h3>
                    </div>

                    <div className="flex bg-background/50 border border-border/50 p-1 rounded-xl w-fit">
                        {['ALL', 'FACULTY', 'STUDENTS'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeFilter === filter
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium animate-pulse">Fetching latest notices...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 text-sm text-center flex flex-col items-center gap-2">
                        <span className="font-bold text-base">Oops! Something went wrong.</span>
                        {error}
                        <button onClick={fetchNotices} className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/20 rounded-lg font-bold text-xs hover:bg-red-200 transition-colors">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && notices.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-background/30">
                        <Bell className="mx-auto text-5xl text-muted-foreground/30 mb-4" />
                        <h4 className="text-lg font-bold text-foreground mb-1">No Notices Found</h4>
                        <p className="text-sm font-medium text-muted-foreground">There are currently no announcements for this category.</p>
                    </div>
                )}

                {/* Notices List */}
                {!isLoading && !error && notices.length > 0 && (
                    <div className="grid gap-5">
                        {notices.map((notice) => (
                            <div 
                                key={notice._id || notice.id} 
                                className="group bg-background/50 dark:bg-muted/20 border border-border/50 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-4">
                                    <h4 className="text-lg font-bold text-foreground leading-snug pr-4">
                                        {notice.subject}
                                    </h4>
                                    
                                    {/* Action & Badge Container */}
                                    <div className="shrink-0 flex items-center gap-3 self-start">
                                        {getAudienceBadge(notice.targetAudience)}
                                        
                                        {/* EDIT BUTTON */}
                                        <button 
                                            onClick={() => openEditModal(notice)}
                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                            title="Edit Notice"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mb-5">
                                    {notice.body} 
                                </p>
                                
                                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider border-t border-border/50 pt-4">
                                    <span className="flex items-center gap-1.5 bg-background/50 py-1 px-2.5 rounded-md">
                                        <Calendar size={13} />
                                        {formatDate(notice.createdAt || new Date())}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- EDIT MODAL OVERLAY --- */}
            {isEditModalOpen && editingNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    {/* Modal Content */}
                    <div className="bg-surface w-full max-w-lg rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50">
                            <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                                <Pencil className="text-primary" /> Edit Notice
                            </h3>
                            <button 
                                onClick={closeEditModal}
                                className="p-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
                            {updateError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm">
                                    {updateError}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
                                <input
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    type="text"
                                    value={editingNotice.subject}
                                    onChange={(e) => setEditingNotice({...editingNotice, subject: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Content / Body</label>
                                <textarea
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[120px] resize-none"
                                    value={editingNotice.body}
                                    onChange={(e) => setEditingNotice({...editingNotice, body: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Audience</label>
                                <select 
                                    className="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    value={editingNotice.targetAudience}
                                    onChange={(e) => setEditingNotice({...editingNotice, targetAudience: e.target.value})}
                                >
                                    <option value="ALL">All (Global)</option>
                                    <option value="FACULTY">Faculty Only</option>
                                    <option value="STUDENTS">Students Only</option>
                                </select>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-4 border-t border-border/50">
                                <button 
                                    type="button" 
                                    onClick={closeEditModal}
                                    className="flex-1 py-3 bg-muted/30 hover:bg-muted/50 text-foreground rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? <span className="animate-pulse">Saving...</span> : <><Save size={18}/> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}