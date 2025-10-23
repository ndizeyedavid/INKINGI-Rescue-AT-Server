import axios from "axios";
import { BACKEND_API_CONFIG, BACKEND_ENDPOINTS } from "../config/backendApi.js";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_API_CONFIG.BASE_URL,
  timeout: BACKEND_API_CONFIG.TIMEOUT,
  headers: BACKEND_API_CONFIG.HEADERS,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 Backend API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Backend API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Backend API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Backend API Error: ${error.response?.status || 'Network Error'} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

/**
 * Report emergency to backend
 * @param {Object} emergencyData - Emergency data
 * @returns {Promise<Object>}
 */
export const reportEmergency = async (emergencyData) => {
  try {
    const response = await apiClient.post(BACKEND_ENDPOINTS.REPORT_EMERGENCY, emergencyData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error reporting emergency:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get all emergencies
 * @param {Object} params - Query parameters (limit, offset, status)
 * @returns {Promise<Object>}
 */
export const getEmergencies = async (params = {}) => {
  try {
    const response = await apiClient.get(BACKEND_ENDPOINTS.GET_EMERGENCIES, { params });
    
    // Transform backend response to match expected format
    const emergencies = response.data?.data || [];
    
    return {
      success: true,
      data: {
        emergencies: emergencies,
        total: emergencies.length,
      },
    };
  } catch (error) {
    console.error("Error fetching emergencies:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get emergency by ID
 * @param {string} emergencyId - Emergency ID
 * @returns {Promise<Object>}
 */
export const getEmergencyById = async (emergencyId) => {
  try {
    const response = await apiClient.get(`${BACKEND_ENDPOINTS.GET_EMERGENCY_BY_ID}/${emergencyId}`);
    
    // Transform backend response
    const emergency = response.data?.data || response.data;
    
    return {
      success: true,
      data: emergency,
    };
  } catch (error) {
    console.error("Error fetching emergency:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get user's emergencies
 * @param {string} phoneNumber - User phone number
 * @returns {Promise<Object>}
 */
export const getUserEmergencies = async (phoneNumber) => {
  try {
    const response = await apiClient.get(BACKEND_ENDPOINTS.GET_USER_EMERGENCIES, {
      params: { phoneNumber },
    });
    
    // Transform backend response to match expected format
    const emergencies = response.data?.data || [];
    
    return {
      success: true,
      data: {
        emergencies: emergencies,
        total: emergencies.length,
      },
    };
  } catch (error) {
    console.error("Error fetching user emergencies:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Trigger distress alert
 * @param {Object} distressData - Distress alert data (phoneNumber, message, location)
 * @returns {Promise<Object>}
 */
export const triggerDistressAlert = async (distressData) => {
  try {
    const response = await apiClient.post(BACKEND_ENDPOINTS.TRIGGER_DISTRESS, distressData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error triggering distress alert:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get community posts
 * @param {Object} params - Query parameters (limit, offset)
 * @returns {Promise<Object>}
 */
export const getPosts = async (params = {}) => {
  try {
    const response = await apiClient.get(BACKEND_ENDPOINTS.GET_POSTS, { params });
    
    // Transform backend response to match expected format
    const posts = response.data?.data || [];
    
    return {
      success: true,
      data: {
        posts: posts,
        total: posts.length,
      },
    };
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<Object>}
 */
export const getPostById = async (postId) => {
  try {
    const response = await apiClient.get(`${BACKEND_ENDPOINTS.GET_POST_BY_ID}/${postId}`);
    
    // Transform backend response
    const post = response.data?.data || response.data;
    
    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Create or get user
 * @param {Object} userData - User data
 * @returns {Promise<Object>}
 */
export const createOrGetUser = async (userData) => {
  try {
    const response = await apiClient.post(BACKEND_ENDPOINTS.CREATE_USER, userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating/getting user:", error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

