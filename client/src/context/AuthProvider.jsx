import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts true so protected routes wait instead of bouncing to /login
  // while we ask the server whether the cookie is still valid.
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let ignore = false;

    API.get("/auth/me")
      .then(({ data }) => {
        if (!ignore) setUser(data);
      })
      .catch(() => {
        // No cookie, or an expired one. Staying logged out is the right answer.
        if (!ignore) setUser(null);
      })
      .finally(() => {
        if (!ignore) setIsLoadingUser(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(() => {
    const login = async (credentials) => {
      const { data } = await API.post("/auth/login", credentials);
      setUser(data);
      return data;
    };

    const register = async (details) => {
      const { data } = await API.post("/auth/register", details);
      setUser(data);
      return data;
    };

    const logout = async () => {
      try {
        await API.post("/auth/logout");
      } finally {
        // Clear locally even if the request failed, so the UI never
        // strands someone in a session they think they have left.
        setUser(null);
      }
    };

    return {
      user,
      isLoadingUser,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
    };
  }, [user, isLoadingUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
