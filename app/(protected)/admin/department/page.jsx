"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux'; // <-- Import Redux hook
import { getDepartments, deleteDepartment } from '@/features/admin/department/department.api';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export default function DepartmentsListPage() {
  // Access the user from Redux store to check their role
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.roleId === 1;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments on component mount
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDepartments(); 
      setDepartments(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle department deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await deleteDepartment(id);
      // Remove the deleted department from state to update UI instantly
      setDepartments(departments.filter(dept => dept.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete department");
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-12 bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="text-indigo-600" size={32} />
              Departments
            </h1>
            <p className="text-gray-500 mt-1">Manage all academic departments across your institution.</p>
          </div>
          
          <Link 
            href="/admin/department/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-200"
          >
            <Plus size={20} />
            Add Department
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error loading departments</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={fetchDepartments}
              className="ml-auto text-sm underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Data Container */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/50 rounded-3xl border border-white overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
              <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
              <p>Loading departments...</p>
            </div>
          ) : departments.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Building2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No departments found</h3>
              <p className="text-gray-500 mt-1 max-w-sm">Get started by creating your first department for the college.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-5">Department Name</th>
                    
                    {/* Conditionally render College ID header */}
                    {isSuperAdmin && (
                      <th className="p-5">College ID</th> 
                    )}
                    
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((dept) => (
                    <tr 
                      key={dept.id} 
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="p-5">
                        <span className="font-medium text-gray-900">{dept.name}</span>
                      </td>

                      {/* Conditionally render College ID data cell */}
                      {isSuperAdmin && (
                        <td className="p-5 text-gray-500">
                          {dept.collegeId ? `Col-${dept.collegeId}` : 'N/A'}
                        </td>
                      )}

                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          
                          {/* Edit Button */}
                          <Link
                            href={`/admin/department/edit/${dept.id}`}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            title="Edit Department"
                          >
                            <Edit size={18} />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Department"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                        </div>
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