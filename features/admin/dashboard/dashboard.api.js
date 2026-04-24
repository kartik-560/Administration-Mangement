const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getDashboardKpis = async (collegeId) => {
    try {
        const token = localStorage.getItem('token'); // Grab the token
        
        const response = await fetch(`${API_BASE_URL}/dashboard/kpi-counts?collegeId=${collegeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token
            }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch KPIs');
        return data;
    } catch (error) {
        console.error("Dashboard KPI Error:", error);
        throw error;
    }
};

export const getActivityLogs = async (limit = 10, moduleFilter = '') => {
    try {
        const token = localStorage.getItem('token'); 
        
        let url = `${API_BASE_URL}/activities?limit=${limit}`;
        if (moduleFilter) {
            url += `&module=${moduleFilter}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch activity logs');
        
        return data.data; 
    } catch (error) {
        console.error("Fetch Activities Error:", error);
        throw error;
    }
};

export const publishNotice = async (noticeData) => {
    try {
        const token = localStorage.getItem('token'); 
        
        const response = await fetch(`${API_BASE_URL}/notices`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(noticeData)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to publish notice');
        return data;
    } catch (error) {
        console.error("Publish Notice Error:", error);
        throw error;
    }
};

export const getNotices = async (collegeId, targetAudience = 'ALL') => {
    try {
        const token = localStorage.getItem('token'); 
        
        // Build the query string
        let url = `${API_BASE_URL}/notices?collegeId=${collegeId}`;
        
        // If we want to filter by audience (and it's not 'ALL'), append it
        if (targetAudience && targetAudience !== 'ALL') {
            url += `&targetAudience=${targetAudience}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch notices');
        
        // Your backend controller sends { success: true, data: notices }
        return data.data; 
    } catch (error) {
        console.error("Fetch Notices Error:", error);
        throw error;
    }
};

export const updateNotice = async (noticeId, noticeData) => {
    try {
        const token = localStorage.getItem('token'); 
        
        // Assuming your backend route is PUT /api/notices/:id
        const response = await fetch(`${API_BASE_URL}/notices/${noticeId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(noticeData)
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update notice');
        return data; 
    } catch (error) {
        console.error("Update Notice Error:", error);
        throw error;
    }
};