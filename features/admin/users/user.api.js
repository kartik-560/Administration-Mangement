const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; 

/**
 * Fetches all users associated with a specific college.
 * @param {string} collegeId - The MongoDB ObjectId of the college.
 * @returns {Promise<Object>} - The response object containing the users array.
 */
export const fetchCollegeUsers = async (collegeId) => {
    try {
        const token = localStorage.getItem('token'); // Grab token for the backend
        
        // 🚨 CHANGED: Updated the URL to match /users/college/:collegeId
        const response = await fetch(`${API_BASE_URL}/users/college/${collegeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Hand it to Express
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        return data;
    } catch (error) {
        console.error("Error in fetchCollegeUsers API:", error);
        throw error;
    }
};