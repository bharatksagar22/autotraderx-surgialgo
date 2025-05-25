const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const request = async (endpoint, options = {}) => {
  const { body, ...customConfig } = options;
  const headers = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('smartTraderToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
  } catch (error) {
    console.error(`API call error for endpoint ${endpoint}:`, error);
    throw error;
  }
};

// Authentication
export const loginUser = (credentials) => request('/login', { method: 'POST', body: credentials }); 

// Strategies
export const getStrategies = () => request('/strategies');
export const getStrategyById = (id) => request(`/strategies/${id}`);
export const createStrategy = (data) => request('/strategies', { method: 'POST', body: data });
export const updateStrategy = (id, data) => request(`/strategies/${id}`, { method: 'PUT', body: data });
export const deleteStrategy = (id) => request(`/strategies/${id}`, { method: 'DELETE' });
export const getGeneratedStrategies = () => request('/strategies/generated');
export const approveStrategy = (strategyId, approvalData) => request(`/strategies/approve`, { method: 'POST', body: { strategy_id: strategyId, ...approvalData } });
export const toggleStrategyStatus = (strategyId, isActive) => request(`/strategies/${strategyId}/toggle`, { method: 'PATCH', body: { active: isActive } });


// Signals
export const getLatestSignals = (userId) => request(`/signals/latest?userId=${userId}`);

// Performance
export const getDailyPerformance = (userId, date) => request(`/performance/daily?userId=${userId}&date=${date}`);

// User Management (Admin)
export const getUsers = () => request('/admin/users');
export const getUserById = (userId) => request(`/admin/users/${userId}`);
export const createUser = (userData) => request('/admin/users', { method: 'POST', body: userData });
export const updateUser = (userId, userData) => request(`/admin/users/${userId}`, { method: 'PUT', body: userData });
export const deleteUser = (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' });

// User Profile & API Keys
export const getUserProfile = () => request('/profile/me'); 
export const updateUserProfile = (profileData) => request('/profile/me', { method: 'PUT', body: profileData }); 

// Broker Connections
export const connectAngelOneBroker = (credentials) => request('/brokers/angelone/connect', { method: 'POST', body: credentials });


// AI Agent Configuration
export const getAiAgentConfig = () => request('/config/ai-agent');
export const updateAiAgentConfig = (configData) => request('/config/ai-agent', { method: 'PUT', body: configData });


// System Logs (Admin)
export const getSystemLogs = (params) => request(`/admin/logs`, { params });


export default request;