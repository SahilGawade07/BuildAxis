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
  } catch {
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
  let refreshToken: string | null = null;

  if (requireAuth) {
    token = await AsyncStorage.getItem("userToken");
    refreshToken = await AsyncStorage.getItem("refreshToken");
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
  if (refreshToken) {
    headers["x-refresh-token"] = refreshToken;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If backend refreshed the token on-the-fly, capture and persist it
  const newAccessToken = response.headers.get("X-New-Access-Token");
  if (newAccessToken) {
    await AsyncStorage.setItem("userToken", newAccessToken);
  }

  // Check if token expired and try to refresh
  if (response.status === 403 && requireAuth) {
    const newToken = await attemptTokenRefresh();
    if (newToken) {
      // Retry the request with new token
      headers["Authorization"] = `Bearer ${newToken}`;
      // Also re-send refresh token header if available
      const latestRefreshToken = await AsyncStorage.getItem("refreshToken");
      if (latestRefreshToken) {
        headers["x-refresh-token"] = latestRefreshToken;
      }
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

// Manage Organisation page data
export async function getManageOrgPageData(orgId: string): Promise<{
  success: boolean;
  data?: {
    promoters: any[];
    supervisors: any[];
    labours: any[];
    vendors: any[];
  };
  message?: string;
}> {
  const response = await apiRequest(
    `/api/common/manage-org-page-data/${orgId}`,
    {
      method: "GET",
    }
  );
  return response.json();
}

// Get all people with pagination for view all page
export async function getViewAllPeople(
  orgId: string,
  role?: string,
  page: number = 1
): Promise<{
  success: boolean;
  data?: {
    people: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
}> {
  const params = new URLSearchParams({
    all: "true",
    page: page.toString(),
  });

  if (role) {
    params.append("role", role);
  }

  const response = await apiRequest(
    `/api/common/manage-org-page-data/${orgId}?${params.toString()}`,
    {
      method: "GET",
    }
  );
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
    await AsyncStorage.multiRemove([
      "userToken",
      "refreshToken",
      "userInfo",
      "organizationInfo",
    ]);
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
  } catch {
    payload = { success: false, message: "Invalid server response" };
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Signup failed");
  }

  return payload;
}

// Create Organization API Call
export async function createOrganizationRequest(orgData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const response = await apiRequest("/api/organisations", {
    method: "POST",
    body: JSON.stringify(orgData),
  });

  if (!response.ok) {
    throw new Error("Failed to create organization");
  }

  return response.json();
}

// Organisation helpers
export async function getOrganisationById(orgId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const response = await apiRequest(`/api/organisations/${orgId}`);
  return response.json();
}

// Add Supervisor to Organisation API Call
export async function addSupervisorToOrganisation(
  supervisorPhone: string
): Promise<{
  success: boolean;
  message: string;
  action?: string;
  data?: any;
}> {
  const response = await apiRequest("/api/organisations/add-supervisor", {
    method: "POST",
    body: JSON.stringify({ supervisorPhone }),
  });

  if (!response.ok) {
    throw new Error("Failed to add supervisor to organisation");
  }

  return response.json();
}

// Create Supervisor API Call
export async function createSupervisorRequest(supervisorData: {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  profilePic?: { uri: string; name: string; type: string };
}): Promise<{
  success: boolean;
  message: string;
  action?: string;
  data?: any;
}> {
  const formData = new FormData();
  formData.append("fName", supervisorData.fName);
  formData.append("lName", supervisorData.lName);
  formData.append("email", supervisorData.email);
  formData.append("phone", supervisorData.phone);
  formData.append("password", supervisorData.password);

  if (supervisorData.profilePic) {
    formData.append("profilePic", supervisorData.profilePic as unknown as any);
  }

  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/organisations/create-supervisor`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  // Try to parse JSON regardless of status to surface server message
  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return (
      payload || {
        success: false,
        message: response.statusText || "Failed to create supervisor",
      }
    );
  }

  return payload as any;
}
