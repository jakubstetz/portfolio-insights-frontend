// API utility with response interceptor for handling 401 errors
import { toast } from "react-hot-toast";

// Reference to the logout function that will be set by AuthContext
let logoutFunction = null;

// Set the logout function to be called on 401 errors
export const setLogoutFunction = (logout) => {
  logoutFunction = logout;
};

// Wrapper around fetch with 401 handling
export const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // If unauthorized (token invalid or expired), log the user out
  if (response.status === 401) {
    if (logoutFunction) {
      logoutFunction();
      // Show a toast notification
      toast.error("Your session has expired. Please log in again.");
    }
    // Return a rejected promise to stop the parent async flow
    // Could throw an error instead, but returning a rejected promise is in-line with fetch's standard behavior
    return Promise.reject(new Error("Unauthorized"));
  }

  return response;
};
