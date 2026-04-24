// Adjust this to match your actual backend URL or environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  let token = null;
  // Ensure we are running on the client side before accessing localStorage
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  
  return {
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

/* ══════════════════════════════════════════════
   TIMETABLE & SCHEDULE APIs
══════════════════════════════════════════════ */

export const getFacultyTimetableApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/timetable`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching timetable:", error);
    throw error;
  }
};

export const getSchedulesApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/schedules`, { headers: getAuthHeaders() });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const createScheduleApi = async (scheduleData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/schedules`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const deleteScheduleApi = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/schedules/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    
    return true; 
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

/* ══════════════════════════════════════════════
   NOTICES APIs
══════════════════════════════════════════════ */

export const getDepartmentNoticesApi = async (departmentId) => {
  try {
    if (!departmentId) return { success: true, data: [] };

    const params = new URLSearchParams({ departmentId }).toString();

    const response = await fetch(`${API_BASE_URL}/notices?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching department notices:", error);
    throw error;
  }
};

export const getMyPublishedNoticesApi = async (userId) => {
  try {
    const queryString = new URLSearchParams({ createdBy: userId }).toString();

    const response = await fetch(`${API_BASE_URL}/notices?${queryString}`, {
      method: "GET",
      headers: getAuthHeaders(), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my published notices:", error);
    throw error;
  }
};

/* ══════════════════════════════════════════════
   ACADEMIC DATA APIs (Subjects & Faculty)
══════════════════════════════════════════════ */

export const getSubjectsApi = async (collegeId, departmentId) => {
  try {
    const params = new URLSearchParams();
    if (collegeId) params.append("collegeId", collegeId);
    if (departmentId) params.append("departmentId", departmentId);

    const res = await fetch(`${API_BASE_URL}/subjects?${params.toString()}`, { 
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

export const getDepartmentFacultiesApi = async (departmentId) => {
  try {
    const params = new URLSearchParams();
    if (departmentId) params.append("departmentId", departmentId);

    const res = await fetch(`${API_BASE_URL}/users/department-faculty?${params.toString()}`, { 
      headers: getAuthHeaders() 
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching faculties:", error);
    throw error;
  }
};

/* ══════════════════════════════════════════════
   DASHBOARD STATS APIs
══════════════════════════════════════════════ */

export const getTodayStatsApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/faculty/stats/today`, {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw errorData || new Error("Failed to fetch today's stats");
    }
    
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};