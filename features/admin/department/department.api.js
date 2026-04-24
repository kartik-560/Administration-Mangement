/**
 * Department API Service
 * Maps all department controller endpoints to frontend service functions.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Fallback to relative path if not set

// Helper function to dynamically grab the token and set headers
const getAuthHeaders = () => {
  // Ensure this only runs on the client side
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 1. Create Department
export const createDepartment = async (departmentData) => {
  const response = await fetch(`${BASE_URL}/departments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(departmentData),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create department');
  return data;
};

// 2. Get All Departments (with optional collegeId filter)
export const getDepartments = async (collegeId = null) => {
  const queryParam = collegeId ? `?collegeId=${collegeId}` : '';
  const response = await fetch(`${BASE_URL}/departments${queryParam}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch departments');
  return data;
};

// 3. Get Single Department by ID
export const getDepartmentById = async (departmentId) => {
  const response = await fetch(`${BASE_URL}/departments/${departmentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch department details');
  return data;
};

// 4. Update Department
export const updateDepartment = async (departmentId, updateData) => {
  const response = await fetch(`${BASE_URL}/departments/${departmentId}`, {
    method: 'PATCH', // or 'PUT' depending on your express route definition
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update department');
  return data;
};

// 5. Delete Department
export const deleteDepartment = async (departmentId) => {
  const response = await fetch(`${BASE_URL}/departments/${departmentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete department');
  return data;
};