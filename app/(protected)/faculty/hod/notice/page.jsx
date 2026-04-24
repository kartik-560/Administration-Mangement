"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  ArrowLeft,
  Plus,
  Globe,
  Users,
  GraduationCap,
  Calendar,
  Loader2,
  FileText
} from "lucide-react";

// ✅ Import your real API function
import { getMyPublishedNoticesApi } from "@/features/faculty/faculty.api"; // Adjust path if needed

export default function MyNoticesPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch User & Notices on Mount
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setError(""); // Clear previous errors
        
        // Safely get user
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("Authentication required. Please log in.");
        }
        
        const user = JSON.parse(userString);
        setCurrentUser(user);

        // ✅ CALL REAL API HERE using the user's ID
        // Note: Checking both .id and ._id depending on your MongoDB mapping
        const userId = user.id || user._id; 
        const response = await getMyPublishedNoticesApi(userId);
        
        // Depending on your backend response structure, it might be response.data or just response
        setNotices(response.data || response || []);

      } catch (err) {
        setError(err.message || "Failed to load notices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Helper to format the audience icon and styling
  const getAudienceConfig = (audience) => {
    switch (audience) {
      case "STUDENTS":
        return { icon: <Users size={14} />, label: "Students", color: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20" };
      case "FACULTY":
        return { icon: <GraduationCap size={14} />, label: "Faculty", color: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20" };
      case "ALL":
      default:
        return { icon: <Globe size={14} />, label: "Everyone", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20" };
    }
  };

  // Helper to format date nicely
 const formatDate = (dateString) => {
    if (!dateString) return "Date not available"; // Fallback to prevent Invalid Date
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
      
      {/* Page Header */}
      <div className="w-full max-w-4xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Megaphone className="text-xl" />
            </div>
            <h1 className="text-2xl font-black font-headline tracking-tight text-foreground">
              My Published Notices
            </h1>
          </div>
        </div>

        <button 
          onClick={() => router.push('/faculty/hod/notice/add')}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0"
        >
          <Plus size={18} />
          Create New Notice
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl">
        
        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-surface border border-border/50 rounded-[2rem] p-12 flex flex-col items-center justify-center shadow-sm h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading your notices...</p>
          </div>
        ) : notices.length === 0 ? (
          
          /* Empty State */
          <div className="bg-surface border border-border/50 rounded-[2rem] p-12 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-4 text-muted-foreground/50">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No Notices Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              You haven't published any department notices yet. Click the button above to create your first announcement.
            </p>
            <button 
              onClick={() => router.push('/faculty/hod/notice/add')}
              className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors"
            >
              Publish a Notice
            </button>
          </div>

        ) : (
          
          /* Notices Grid/List */
          <div className="grid grid-cols-1 gap-4">
            {notices.map((notice) => {
              const audience = getAudienceConfig(notice.targetAudience);
              
              return (
                <div 
                  key={notice.id || notice._id} 
                  className="bg-surface border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Left: Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Target Audience Badge */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${audience.color}`}>
                          {audience.icon}
                          {audience.label}
                        </div>
                        
                        {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ml-2">
  <Calendar size={12} />
  {/* 👇 Change createdAt to publishDate */}
  {formatDate(notice.publishDate)} 
</div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {notice.subject || notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-wrap">
                        {notice.body || notice.content}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}