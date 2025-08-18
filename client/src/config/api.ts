export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  challenges: `${API_BASE_URL}/api/challenges`,
  users: `${API_BASE_URL}/api/users`,
  achievements: `${API_BASE_URL}/api/achievements`,
  submissions: `${API_BASE_URL}/api/submissions`,
};

export default API_BASE_URL;