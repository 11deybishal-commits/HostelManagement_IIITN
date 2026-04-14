/* eslint-disable no-useless-catch */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Complaint API functions
export const complaintAPI = {
  // Create a new complaint
  createComplaint: async (complaintData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Public live summary for the home screen
  getLiveSummary: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/summary`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get complaint by ID
  getComplaintStatus: async (complaintId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/complaint/${complaintId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all complaints (admin only)
  getAllComplaints: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update complaint status (admin only)
  updateComplaintStatus: async (complaintId, updates, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete complaint (admin only)
  deleteComplaint: async (complaintId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get analytics by category
  getAnalyticsByCategory: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/analytics/category`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get analytics by status
  getAnalyticsByStatus: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/analytics/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Admin API functions
export const adminAPI = {
  // Admin login
  login: async (email, password) => {
    try {
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const normalizedPassword = typeof password === 'string' ? password.trim() : '';

      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Admin registration
  register: async (adminData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: adminData.email,
          password: adminData.password,
          name: adminData.name,
          department: adminData.department,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get admin profile
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create new admin
  createAdmin: async (adminData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Local storage helpers
export const authStorage = {
  setToken: (token) => localStorage.setItem('adminToken', token),
  getToken: () => localStorage.getItem('adminToken'),
  removeToken: () => localStorage.removeItem('adminToken'),
  setAdmin: (admin) => localStorage.setItem('admin', JSON.stringify(admin)),
  getAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
  removeAdmin: () => localStorage.removeItem('admin'),
  isLoggedIn: () => !!localStorage.getItem('adminToken'),
};
