'use client'

import React from 'react';
import { LuPencil, LuTrash2, LuMoreVertical, LuSearch, LuFilter } from 'react-icons/lu';

const users = [
    { id: '#SC-2024-001', name: 'Julian Dash', role: 'Student', dept: 'Computer Science', status: 'Active', initials: 'JD' },
    { id: '#FC-2024-042', name: 'Sarah Richardson', role: 'Faculty', dept: 'Mathematics', status: 'Active', initials: 'SR' },
    { id: '#SC-2024-118', name: 'Mark Adams', role: 'Student', dept: 'Physics', status: 'On Leave', initials: 'MA' },
];

export default function UserTable() {
    return (
        <div className="bg-surface rounded-[2rem] overflow-hidden border border-border/50 shadow-sm transition-all duration-500">
            <div className="px-8 py-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground font-headline">Manage Campus Users</h3>
                    <p className="text-xs text-muted-foreground font-medium">Control administrative access and records.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 bg-background/50 hover:bg-muted rounded-xl border border-border/50 text-muted-foreground hover:text-primary transition-all">
                        <LuFilter size={18} />
                    </button>
                    <button className="p-2.5 bg-background/50 hover:bg-muted rounded-xl border border-border/50 text-muted-foreground hover:text-primary transition-all">
                        <LuSearch size={18} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">User Details</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Role</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Department</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/10">
                                            {user.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">{user.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium text-foreground/70">{user.role}</td>
                                <td className="px-8 py-5 text-sm font-medium text-foreground/70">{user.dept}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'Active'
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors">
                                            <LuPencil size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors">
                                            <LuTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}