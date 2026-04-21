// auth/login/login.api.js

// Replace this with your actual backend URL or use environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 

export const loginUserApi = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // If the response status is not 2xx, throw an error to be caught by the component
    if (!response.ok) {
      throw new Error(data.message || "Failed to log in");
    }

    return data;
  } catch (error) {
    throw error;
  }
};