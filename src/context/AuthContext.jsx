// AuthContext manages authentication state and actions across the app.
import { createContext, useState, useEffect } from "react";

// Create the context object — essentially a global state that can be accessed by any
// component in the app
const AuthContext = createContext();

// Provider component to wrap app and supply auth state/functions to child components
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking localStorage

  useEffect(() => {
    // On mount, restore user from localStorage if possible
    // This allows the user to stay logged in across page reloads
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      // User data and token exist in localStorage
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        logout(); // Clear invalid data to avoid inconsistent state
      }
    }
    setLoading(false);
  }, []);

  // Log in: persist user and token in localStorage
  const login = (token, userData) => {
    // Note that token storage in localStorage is convenient for an MVP but is not secure
    // In production, HTTP-only cookies should be used
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Log out: clear user and token from localStorage
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Get token for API requests
  const getToken = () => localStorage.getItem("token");

  // Provide state and actions to children
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}
