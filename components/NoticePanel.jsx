"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Send,
  Users,
  GraduationCap,
  Globe,
} from "lucide-react";
import { publishNotice } from "@/features/admin/dashboard/dashboard.api";

export default function NoticePanel() {
  // 1. Setup State
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Clear old messages

    if (!subject.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Subject and Content are required." });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get the logged-in user's info from localStorage (or your state manager)
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (!user || !user.id || !user.collegeId) {
        throw new Error(
          "User authentication data (id or collegeId) is missing.",
        );
      }

      // 2. Map frontend state to backend requirements
      const payload = {
        subject: subject,
        body: content, // Changed from 'content' to 'body'
        targetAudience: targetAudience,
        publishedById: user.id, // Added required publishedById (might be user._id)
        collegeId: user.collegeId, // Added the required collegeId!
      };

      // 3. Send to API
      await publishNotice(payload);

      setMessage({ type: "success", text: "Notice published successfully!" });

      // Clear form
      setSubject("");
      setContent("");
      setTargetAudience("ALL");

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
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
    <div className="bg-surface rounded-[2rem] p-8 border border-border/50 shadow-sm transition-all duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
          <Megaphone className="text-xl" />
        </div>
        <h3 className="text-xl font-bold text-foreground font-headline">
          Publish Notice
        </h3>
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
            Audience
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
          disabled={isLoading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          <Send size={18} className={isLoading ? "animate-pulse" : ""} />
          {isLoading ? "Posting..." : "Post Notice"}
        </button>
      </form>
    </div>
  );
}

// Updated to accept an onClick prop
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
