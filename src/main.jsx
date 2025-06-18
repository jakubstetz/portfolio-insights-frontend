/*
Main entry point for the React frontend.
Start with the shell command: npm run dev
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./jakub-baseline.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext"; // Wraps the app in the AuthProvider, which provides the AuthContext to all child components

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
