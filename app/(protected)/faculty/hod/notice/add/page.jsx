"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Send,
  Users,
  GraduationCap,
  Globe,
  ArrowLeft,
  Building2
} from "lucide-react";

// Make sure to update this import path if needed!
import { publishNotice } from "@/features/admin/dashboard/dashboard.api"; 

export default function PublishDepartmentNoticePage() {
  const router = useRouter();

  // 1. Setup State
  const [currentUser, setCurrentUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Safely grab the user from localStorage on mount
  // (Doing this in useEffect prevents Next.js hydration errors)
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Subject and Content are required." });
      return;
    }

    if (!currentUser || !currentUser.id) {
      setMessage({ type: "error", text: "Authentication error. Please log in again." });
      return;
    }

    // Safely extract the department ID (Usually inside facultyProfile for HODs/Faculty)
    const deptId = currentUser.departmentId || currentUser.facultyProfile?.departmentId;

    if (!deptId) {
      setMessage({ type: "error", text: "Error: No department assigned to your profile." });
      return;
    }

    setIsLoading(true);

    try {
      // The updated payload mapping
      const payload = {
        subject: subject,
        body: content, 
        targetAudience: targetAudience,
        publishedById: currentUser.id, 
        collegeId: currentUser.collegeId, 
        departmentId: deptId // 👈 THE NEW ADDITION: Ties it to the department!
      };

      // Send to API
      await publishNotice(payload);

      setMessage({ type: "success", text: "Department notice published successfully!" });

      // Clear form
      setSubject("");
      setContent("");
      setTargetAudience("ALL");

      // Route back to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/faculty/hod'); // Or wherever your dashboard is
      }, 2000);

    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to post notice.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center">
      
      {/* Page Header Area */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Department Badge Indicator */}
        {currentUser && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-wider">
            <Building2 size={12} />
            Department Notice
          </div>
        )}
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-2xl bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm transition-all duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
            <Megaphone className="text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground font-headline">
              Publish Notice
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              This announcement will only be visible to members of your department.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              Subject
            </label>
            <input
              className="w-full bg-background/50 dark:bg-muted/20 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground placeholder:text-muted-foreground/30"
              placeholder="Notice heading..."
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              Content
            </label>
            <textarea
              className="w-full bg-background/50 dark:bg-muted/20 border border-border/50 rounded-2xl px-5 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-foreground placeholder:text-muted-foreground/30 min-h-[120px] resize-none"
              placeholder="Detailed announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              Target Audience
            </label>
            <div className="grid grid-cols-3 gap-2">
              <AudienceButton
                icon={<Globe />}
                label="All"
                active={targetAudience === "ALL"}
                onClick={() => setTargetAudience("ALL")}
              />
              <AudienceButton
                icon={<GraduationCap />}
                label="Faculty"
                active={targetAudience === "FACULTY"}
                onClick={() => setTargetAudience("FACULTY")}
              />
              <AudienceButton
                icon={<Users />}
                label="Students"
                active={targetAudience === "STUDENTS"}
                onClick={() => setTargetAudience("STUDENTS")}
              />
            </div>
          </div>

          {/* Status Message Display */}
          {message.text && (
            <div
              className={`text-sm p-3 rounded-xl ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !currentUser}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            <Send size={18} className={isLoading ? "animate-pulse" : ""} />
            {isLoading ? "Publishing..." : "Post Notice"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Kept your AudienceButton exactly the same!
function AudienceButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
        active
          ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
          : "bg-background/30 border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
  );
}