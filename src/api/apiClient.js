// API utility for communicating with backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://esports-live-scores-wpph.vercel.app';
const API_KEY = import.meta.env.VITE_API_KEY || 'tAHcwSeouKpcgo1ku4FX49IzGXcCsmSxY76jufLp';

// Auto-clear stale token on 401/403 so the app recovers on next load
const handleAuthError = (status) => {
  if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token to localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

const apiClient = {
  // GET request
  async get(endpoint, useAuth = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add API key for non-auth endpoints
      if (!endpoint.startsWith('/api/auth')) {
        headers['x-api-key'] = API_KEY;
      }

      // Add auth token if needed
      if (useAuth) {
        const token = getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  // POST request
  async post(endpoint, data, useAuth = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add API key for non-auth endpoints
      if (!endpoint.startsWith('/api/auth')) {
        headers['x-api-key'] = API_KEY;
      }

      // Add auth token if needed
      if (useAuth) {
        const token = getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error(responseData.message || `HTTP ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  // PUT request
  async put(endpoint, data, useAuth = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add API key for non-auth endpoints
      if (!endpoint.startsWith('/api/auth')) {
        headers['x-api-key'] = API_KEY;
      }

      // Add auth token if needed
      if (useAuth) {
        const token = getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error(responseData.message || `HTTP ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  // DELETE request
  async delete(endpoint, useAuth = false) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add API key for non-auth endpoints
      if (!endpoint.startsWith('/api/auth')) {
        headers['x-api-key'] = API_KEY;
      }

      // Add auth token if needed
      if (useAuth) {
        const token = getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        handleAuthError(response.status);
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  },

  // Auth specific methods
  auth: {
    async register(userData) {
      const response = await apiClient.post('/api/auth/register', userData);
      if (response.token) {
        setToken(response.token);
      }
      return response;
    },

    async login(credentials) {
      const response = await apiClient.post('/api/auth/login', credentials);
      if (response.token) {
        setToken(response.token);
      }
      return response;
    },

    async getProfile() {
      return await apiClient.get('/api/auth/profile', true);
    },

    async updateProfile(userData) {
      return await apiClient.put('/api/auth/profile', userData, true);
    },

    logout() {
      removeToken();
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    },

    isAuthenticated() {
      return !!getToken();
    }
  }
};

export default apiClient;
