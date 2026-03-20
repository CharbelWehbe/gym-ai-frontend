import axios from "axios";
import { BASE_URL } from "./config";

// Set your API base URL here
const url = `${BASE_URL}/api`; // Replace with your actual backend URL

// Create the axios instance with default headers
const API = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically attach token to each request (if exists)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Something went wrong before request sent
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }
);

// Handle all global errors in one place
API.interceptors.response.use(
  (response) => response, // All good, return the response
  (error) => {
    if (!error.response) {
      //Network error or no response
      alert(
        "Network error: Please check your internet connection or try again later."
      );
      return Promise.reject({ message: "Network error" });
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        //Unauthorized (e.g., token expired)
        console.warn("Unauthorized — logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
        break;

      case 403:
        // Forbidden — user not allowed to access this resource
        alert(
          "Access denied: You don't have permission to perform this action."
        );
        break;

      case 404:
        // Resource not found
        alert("Resource not found.");
        break;

      case 422:
        // Validation error (e.g. form input wrong)
        // Return full error so local page (e.g. LoginPage) can handle/display it
        return Promise.reject(
          data.errors || data.message || "Validation error"
        );

      case 500:
        //Internal server error
        alert(
          "Server error: Something went wrong on our end. Please try again later."
        );
        break;

      default:
        // Unexpected error
        alert(
          `Error ${status}: ${data?.message || "An unexpected error occurred."}`
        );
    }

    return Promise.reject(error);
  }
);

export default API;