import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// ✅ Extract host (IPv4) from Metro URL
function getLocalIpFromExpoUrl(): string | null {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (!debuggerHost) return null;

  // debuggerHost is like "192.168.1.4:8081"
  const ip = debuggerHost.split(":")[0];
  return ip;
}

// ✅ Set API base dynamically
const localIp = getLocalIpFromExpoUrl();
export const API_BASE_URL =
  //process.env.EXPO_PUBLIC_API_URL || // Deployment (server URL from .env/app.config.js)
  localIp ? `http://${localIp}:8000` : "http://localhost:8000"; // Dev fallback

// (Optional) keep your old code commented for reference
// export const API_BASE_URL = "http://10.243.117.112:8000";

// export const API_BASE_URL =
//   process.env.EXPO_PUBLIC_API_URL || "http://10.243.117.112:8000";

type SignInResponse = {
  success: boolean;
  message: string;
  data?: any;
  accessToken?: string;
  refreshToken?: string;
};

type SignUpResponse = {
  success: boolean;
  message: string;
  data?: any;
  accessToken?: string;
  refreshToken?: string;
};

// ---------- Auth API Call ----------

export async function signInRequest(
  email: string,
  password: string
): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let payload: SignInResponse;
  try {
    payload = (await response.json()) as SignInResponse;
  } catch (error) {
    payload = { success: false, message: "Invalid server response" };
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Login failed");
  }

  return payload;
}

// Generic API request function with automatic token refresh
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<Response> {
  let token: string | null = null;

  if (requireAuth) {
    token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add custom headers if provided
  if (options.headers) {
    if (
      typeof options.headers === "object" &&
      !Array.isArray(options.headers)
    ) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === "string") {
          headers[key] = value;
        }
      });
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Check if token expired and try to refresh
  if (response.status === 403 && requireAuth) {
    const newToken = await attemptTokenRefresh();
    if (newToken) {
      // Retry the request with new token
      headers["Authorization"] = `Bearer ${newToken}`;
      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      // Refresh failed, clear tokens and throw error
      await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
      throw new Error("Authentication expired. Please login again.");
    }
  }

  // Handle other error status codes
  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(`${errorMessage} (${response.status})`);
  }

  return response;
}

// Attempt to refresh the access token
async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-refresh-token": refreshToken,
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        // Check if new token is in response headers (backend sets this)
        const newAccessToken = response.headers.get("X-New-Access-Token");
        if (newAccessToken) {
          await AsyncStorage.setItem("userToken", newAccessToken);
          return newAccessToken;
        }

        // Fallback: if no header, check if token is in response body
        if (result.accessToken) {
          await AsyncStorage.setItem("userToken", result.accessToken);
          return result.accessToken;
        }
      }
    }

    // If refresh failed, clear the invalid refresh token
    await AsyncStorage.removeItem("refreshToken");
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear invalid refresh token on error
    await AsyncStorage.removeItem("refreshToken");
    return null;
  }
}

// Helper function to get user profile
export async function getUserProfile(): Promise<any> {
  const response = await apiRequest("/api/common/my-profile");
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
}

// Helper function to update user profile
export async function updateUserProfile(profileData: any): Promise<any> {
  const response = await apiRequest("/api/common/my-profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return response.json();
}

// Helper function to update user password
export async function updatePasswordRequest(params: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> {
  const response = await apiRequest("/api/common/my-profile", {
    method: "PATCH",
    body: JSON.stringify(params),
  });
  return response.json();
}

// Utility function to logout and clear all tokens
export async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint if token exists
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local storage
    await AsyncStorage.multiRemove(["userToken", "refreshToken", "userInfo"]);
  }
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem("userToken");
    return !!token;
  } catch (error) {
    return false;
  }
}

export async function signupRequest(userData: {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  role: "promoter" | "supervisor";
}): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  let payload: SignUpResponse;
  try {
    payload = (await response.json()) as SignUpResponse;
  } catch (error) {
    payload = { success: false, message: "Invalid server response" };
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Signup failed");
  }

  return payload;
}
