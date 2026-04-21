

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 

const getToken = () => {
  // We check if window is defined just in case Next.js tries to run this on the server
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const registerUserApi = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ ADDED: Send the token to prove we are allowed to create users
        "Authorization": `Bearer ${getToken()}` 
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to register user");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getRolesApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "GET", // Default is GET, but good to be explicit
      headers: {
        "Content-Type": "application/json",
        // ✅ ADDED: Send the token to authenticate
        "Authorization": `Bearer ${getToken()}` 
      }
    }); 
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || "Failed to fetch roles");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCollegesApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/colleges`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // ✅ ADDED: Send the token to authenticate
        "Authorization": `Bearer ${getToken()}` 
      }
    }); 
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || "Failed to fetch colleges");
    return data;
  } catch (error) {
    throw error;
  }
};