const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getRoles = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/roles`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch roles');
        return data.data; // Returns the array of roles
    } catch (error) {
        throw error;
    }
};

export const createRole = async (roleData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roleData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create role');
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const updateRole = async (roleId, roleData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(roleData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update role');
        return data.data;
    } catch (error) {
        throw error;
    }
};