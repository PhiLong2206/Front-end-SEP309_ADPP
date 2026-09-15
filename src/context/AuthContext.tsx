import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, LoginRequest, AuthContextType, RoleType } from "../types";
import { getToken, setToken, getUserData, setUserData, clearAuthStorage } from "../utils/token";
import { MOCK_ACCOUNTS, toUser } from "../mocks/accounts";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(getUserData());
  const [loading, setLoading] = useState<boolean>(true);

  const role: RoleType | null = user?.role || null;
  const isAuthenticated = Boolean(tokenState && user);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentToken = getToken();
        const currentUser = getUserData();

        if (currentToken && currentUser && currentUser.role && currentUser.email) {
          setTokenState(currentToken);
          setUser(currentUser);
        } else {
          clearAuthStorage();
          setTokenState(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error);
        clearAuthStorage();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);

    // TODO: Replace mock authentication with authApi.login()
    // when Identity Service is available.
    try {
      // Simulate minimal async delay for realism
      await new Promise((resolve) => setTimeout(resolve, 250));

      const normalizedEmail = (credentials.email || "").trim().toLowerCase();
      const matchedAccount = MOCK_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      );

      if (!matchedAccount || matchedAccount.password !== credentials.password) {
        return {
          success: false,
          message: "Email hoặc mật khẩu không chính xác.",
        };
      }

      const authenticatedUser = toUser(matchedAccount);
      const mockToken = `mock-jwt-${matchedAccount.role.toLowerCase()}`;

      // Persist auth data in localStorage
      setToken(mockToken);
      setUserData(authenticatedUser);

      // Update state
      setTokenState(mockToken);
      setUser(authenticatedUser);

      return {
        success: true,
        user: authenticatedUser,
      };
    } catch (error: unknown) {
      console.error("Login processing error:", error);
      return {
        success: false,
        message: "Email hoặc mật khẩu không chính xác.",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear all stored authentication keys
      clearAuthStorage();
      setTokenState(null);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token: tokenState,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    setUser: (updatedUser: User | null) => {
      setUser(updatedUser);
      setUserData(updatedUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
