"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Loader2, Plus, Search, Trash2, BookOpen } from "lucide-react";
import { getSubjectsApi, deleteSubjectApi } from "@/features/faculty/subject.api"; // Adjust path if needed

export default function ListSubjectsPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Subjects on Mount
  useEffect(() => {
    if (!currentUser?.collegeId) return;

    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        const response = await getSubjectsApi({ collegeId: currentUser.collegeId });
        setSubjects(response.data || []);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [currentUser]);

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    try {
      await deleteSubjectApi(id);
      // Remove from UI immediately after successful deletion
      setSubjects((prev) => prev.filter((s) => s.id !== id && s._id !== id));
    } catch (error) {
      alert("Failed to delete subject. It might be linked to a schedule.");
    }
  };

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(
    (s) => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-body min-h-screen text-gray-900 dark:text-gray-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight m-0">Subjects Directory</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">Manage all academic subjects in your college.</p>
          </div>
          <Link href="/faculty/subject/add">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#4c6ef5] text-white rounded-lg text-sm font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              Add New Subject
            </button>
          </Link>
        </div>

        {/* Toolbar: Search */}
        <div className="bg-white dark:bg-[#13151e] border border-gray-200 dark:border-gray-800 p-4 rounded-t-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4c6ef5]/40 transition-all"
            />
          </div>
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Total: {filteredSubjects.length}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#13151e] border border-t-0 border-gray-200 dark:border-gray-800 rounded-b-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#4c6ef5] mb-4" />
              <p className="text-sm font-medium text-gray-500">Loading subjects...</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-70">
              <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-base font-bold text-gray-500">No subjects found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or add a new subject.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#1a1d27] border-b border-gray-200 dark:border-gray-800">
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Subject Name</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject.id || subject._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-5">
                        <p className="text-sm font-bold text-gray-900 dark:text-white m-0">{subject.name}</p>
                      </td>
                      <td className="py-3 px-5">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-mono font-bold text-gray-600 dark:text-gray-300">
                          {subject.subjectCode || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                          {subject.semester || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button 
                          onClick={() => handleDelete(subject.id || subject._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}