// features/auth/signup/signup.api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 1. Step 2 of Flow: User sets their password
export const completeSignupApi = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete signup");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 2. Step 3 of Flow: User submits their Student/Faculty academic details
export const completeProfileApi = async (profileData) => {
  try {
    // 1. Grab the token that was saved during the signup step!
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token missing. Please log in again.");
    }

    // 2. Hit the protected route we just made in the backend
    const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // CRITICAL: This is how the backend auth middleware verifies the user
      },
      body: JSON.stringify({ profileData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete profile setup");
    }

    return data;
  } catch (error) {
    throw error;
  }
};