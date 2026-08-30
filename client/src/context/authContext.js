import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}

// Turns an axios failure into a message we can show the user.
export const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;
