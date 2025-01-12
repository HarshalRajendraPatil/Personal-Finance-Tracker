import axios from "axios";
import Cookies from "js-cookie"; // Install js-cookie: npm install js-cookie

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/", // Base URL from environment variables or fallback
  timeout: 10000, // Request timeout (in milliseconds)
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Accept JSON response
  },
  withCredentials: true, // Allow sending cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from cookies
    const token = Cookies.get("authToken"); // Replace 'authToken' with your cookie name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request info (for debugging)
    console.log("Request:", config);

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response info (for debugging)
    console.log("Response:", response);

    // Process response data if needed
    return response;
  },
  (error) => {
    // Log error details
    console.error("Response error:", error);

    // Handle specific error scenarios
    if (error.response) {
      // Server responded with a status outside the 2xx range
      if (error.response.status === 401) {
        // Unauthorized: handle logout or token refresh
        console.warn("Unauthorized: Redirecting to login...");
        Cookies.remove("authToken"); // Remove token from cookies
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        // Internal Server Error
        console.error("Server error: Please try again later.");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received from server.");
    } else {
      // Something else happened while setting up the request
      console.error("Unexpected error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
