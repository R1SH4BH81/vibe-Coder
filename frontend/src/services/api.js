import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. The server might be busy.");
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data?.message || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        "Cannot connect to server. Please check if the backend is running.",
      );
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }
  },
);

/**
 * Generate code based on prompt and language
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - The code generation prompt
 * @param {string} params.language - Target programming language
 * @param {boolean} params.includeComments - Whether to include comments
 * @returns {Promise<Object>} Generated code response
 */
export const generateCode = async ({
  prompt,
  language = "javascript",
  includeComments = true,
}) => {
  try {
    const response = await api.post("/api/generate-code", {
      prompt,
      language,
      includeComments,
    });

    return response;
  } catch (error) {
    console.error("Code generation failed:", error);
    throw error;
  }
};

/**
 * Get list of supported programming languages
 * @returns {Promise<Object>} Languages list
 */
export const getLanguages = async () => {
  try {
    const response = await api.get("/api/languages");
    return response;
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get("/api/health");
    return response;
  } catch (error) {
    console.error("Health check failed:", error);
    throw error;
  }
};

export default api;
