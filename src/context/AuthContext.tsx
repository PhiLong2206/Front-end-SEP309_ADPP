import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, LoginRequest, AuthContextType, RoleType } from "../types";
import { getToken, setToken, getRefreshToken, setRefreshToken, getUserData, setUserData, clearAuthStorage } from "../utils/token";
import { getAuthErrorMessage } from "../utils/authError";
import authApi from "../api/authApi";
import userApi from "../api/userApi";

const mapRoleFromRoles = (roles: string[] = []): RoleType => {
  const lowerRoles = roles.map((r) => r.toLowerCase());
  if (lowerRoles.includes("admin") || lowerRoles.includes("administrator")) {
    return "Administrator";
  } else if (
    lowerRoles.includes("organizer") ||
    lowerRoles.includes("educator") ||
    lowerRoles.includes("lecturer")
  ) {
    return "Organizer";
  }
  return "Debater";
};

const normalizeUser = (u: User | null): User | null => {
  if (!u) return null;
  const normalizedRole = mapRoleFromRoles(
    u.roles && u.roles.length > 0 ? u.roles : u.role ? [String(u.role)] : []
  );
  return { ...u, role: normalizedRole };
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(() => normalizeUser(getUserData()));
  const [loading, setLoading] = useState<boolean>(true);

  const role: RoleType | null = user?.role || null;
  const isAuthenticated = Boolean(tokenState && user);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const currentToken = getToken();
      const currentUser = normalizeUser(getUserData());

      if (!currentToken) {
        clearAuthStorage();
        if (isMounted) {
          setTokenState(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // Optimistically restore cached session for fast UI rendering
      if (currentUser && currentUser.email) {
        if (isMounted) {
          setTokenState(currentToken);
          setUser(currentUser);
        }
      }

      try {
        // Source of truth: fetch latest profile & roles directly from backend database
        const profileRes = await userApi.getMyProfile();
        if (!isMounted) return;

        if (profileRes && profileRes.success && profileRes.data) {
          const profile = profileRes.data;
          const freshRoles = profile.roles || [];
          const mappedRole = mapRoleFromRoles(freshRoles);

          const syncedUser: User = {
            id: String(profile.userId),
            userId: profile.userId,
            email: profile.email,
            fullName: profile.fullName,
            role: mappedRole,
            roles: freshRoles,
            avatarUrl: profile.avatarUrl,
            phoneNumber: profile.phoneNumber,
            isActive: profile.isActive,
            createdAt: profile.createdAt || new Date().toISOString(),
          };

          setTokenState(currentToken);
          setUser(syncedUser);
          setUserData(syncedUser);
        } else {
          clearAuthStorage();
          setTokenState(null);
          setUser(null);
        }
      } catch (error) {
        console.warn("Auth sync error:", error);
        const errObj = error as { status?: number; response?: { status?: number } };
        const statusCode = errObj?.status || errObj?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          clearAuthStorage();
          if (isMounted) {
            setTokenState(null);
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);

    try {
      const res = await authApi.login({
        email: (credentials.email || "").trim(),
        password: credentials.password,
      });

      if (res && res.success && res.data?.accessToken) {
        const roles = res.data.user?.roles || [];
        const mappedRole = mapRoleFromRoles(roles);

        const authenticatedUser: User = {
          id: String(res.data.user.userId),
          userId: res.data.user.userId,
          email: res.data.user.email,
          fullName: res.data.user.fullName,
          role: mappedRole,
          roles: roles,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        setToken(res.data.accessToken);
        if (res.data.refreshToken) {
          setRefreshToken(res.data.refreshToken);
        }
        setUserData(authenticatedUser);
        setTokenState(res.data.accessToken);
        setUser(authenticatedUser);

        return {
          success: true,
          user: authenticatedUser,
        };
      }

      return {
        success: false,
        message: getAuthErrorMessage(res, "Email hoặc mật khẩu không chính xác."),
      };
    } catch (apiError: unknown) {
      return {
        success: false,
        message: getAuthErrorMessage(apiError, "Email hoặc mật khẩu không chính xác."),
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (idToken: string) => {
    setLoading(true);

    try {
      const res = await authApi.googleLogin({ idToken });

      if (res && res.success && res.data?.accessToken) {
        const roles = res.data.user?.roles || [];
        const mappedRole = mapRoleFromRoles(roles);

        const authenticatedUser: User = {
          id: String(res.data.user.userId),
          userId: res.data.user.userId,
          email: res.data.user.email,
          fullName: res.data.user.fullName,
          role: mappedRole,
          roles: roles,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        setToken(res.data.accessToken);
        if (res.data.refreshToken) {
          setRefreshToken(res.data.refreshToken);
        }
        setUserData(authenticatedUser);
        setTokenState(res.data.accessToken);
        setUser(authenticatedUser);

        return {
          success: true,
          user: authenticatedUser,
        };
      }

      return {
        success: false,
        message: getAuthErrorMessage(res, "Xác thực tài khoản Google không thành công."),
      };
    } catch (apiError: unknown) {
      return {
        success: false,
        message: getAuthErrorMessage(apiError, "Không thể xác thực tài khoản Google với máy chủ."),
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        try {
          await authApi.revokeToken({ refreshToken: currentRefreshToken });
        } catch {
          // Ignore revoke error on logout
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear all stored authentication keys unconditionally
      clearAuthStorage();
      setTokenState(null);
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token: tokenState,
    role,
    isAuthenticated,
    loading,
    login,
    googleLogin,
    logout,
    setUser: (updatedUser: User | null) => {
      setUser(updatedUser);
      setUserData(updatedUser);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

