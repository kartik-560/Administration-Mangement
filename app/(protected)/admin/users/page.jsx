'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Hook into your Redux store
import { fetchCollegeUsers } from '@/features/admin/users/user.api'; 
import { Search, Filter, Mail, MoreVertical } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Look how clean this is now! Pull the user straight from Redux.
    // AuthChecker guarantees this user exists if they made it to this page.
    const user = useSelector((state) => state.auth.user);
    const collegeId = user?.collegeId;

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const res = await fetchCollegeUsers(collegeId);
                if (res.success) {
                    setUsers(res.data);
                }
            } catch (error) {
                console.error("Failed to load users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (collegeId) {
            loadUsers();
        }
    }, [collegeId]);

    // Local search filter
    const filteredUsers = users.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) || 
               u.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Wait for Redux to hydrate via AuthChecker
    if (!collegeId) {
        return <div className="mt-20 text-center text-muted-foreground animate-pulse">Loading directory...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 mt-10 px-2 md:px-0">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight font-headline text-foreground">
                        User Directory
                    </h1>
                    <p className="text-muted-foreground mt-1 font-body">
                        Manage students, faculty, and administrative staff.
                    </p>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
                {/* Search & Filter Toolbar */}
                <div className="p-6 border-b border-border/50 flex flex-col md:flex-row justify-between gap-4 bg-background/20">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-5 py-3 border border-border/50 rounded-xl text-sm font-bold text-foreground hover:bg-muted/50 transition-colors">
                        <Filter className="text-muted-foreground" />
                        Filters
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/40 border-b border-border/50 text-xs uppercase tracking-widest text-muted-foreground">
                                <th className="p-6 font-bold">User</th>
                                <th className="p-6 font-bold">Role</th>
                                <th className="p-6 font-bold">Status</th>
                                <th className="p-6 font-bold">Joined</th>
                                <th className="p-6 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">No users found matching your search.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{u.firstName} {u.lastName}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Mail size={12} /> {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1.5 rounded-lg bg-background border border-border/50 text-xs font-bold text-foreground">
                                                {u.role?.name || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex w-max items-center gap-1.5 ${
                                                u.status === 'ACTIVE' 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-sm text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                                                <MoreVertical />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}