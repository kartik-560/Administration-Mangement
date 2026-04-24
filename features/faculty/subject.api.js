// Adjust this to match your actual backend URL or environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  
  return {
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

/**
 * Fetch all subjects (Optionally filter by collegeId or departmentId)
 */
export const getSubjectsApi = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.collegeId) params.append("collegeId", filters.collegeId);
    if (filters.departmentId) params.append("departmentId", filters.departmentId);

    const res = await fetch(`${API_BASE_URL}/subjects?${params.toString()}`, { 
      method: "GET",
      headers: getAuthHeaders() 
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

/**
 * Fetch a single subject by its ID
 */
export const getSubjectByIdApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching subject ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new subject
 */
export const createSubjectApi = async (subjectData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error;
  }
};

/**
 * Update an existing subject
 */
export const updateSubjectApi = async (id, subjectData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "PUT", // Change to PATCH if your backend uses PATCH
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error updating subject ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a subject
 */
export const deleteSubjectApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    
    // Deletes often return 204 No Content, so we don't try to parse JSON
    return true; 
  } catch (error) {
    console.error(`Error deleting subject ${id}:`, error);
    throw error;
  }
};