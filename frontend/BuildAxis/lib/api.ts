import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Sites } from "@/types/sites";
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

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // If backend refreshed the token on-the-fly, capture and persist it
    const newAccessToken = response.headers["x-new-access-token"];
    if (newAccessToken) {
      AsyncStorage.setItem("userToken", newAccessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't already tried to refresh
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await attemptTokenRefresh();
        if (newToken) {
          // Retry the request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
        throw new Error("Authentication expired. Please login again.");
      }
    }

    return Promise.reject(error);
  }
);

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
  try {
    const response: AxiosResponse<SignInResponse> = await api.post(
      "/api/auth/signin",
      {
        email,
        password,
      }
    );

    const payload = response.data;
    if (!payload.success) {
      throw new Error(payload.message || "Login failed");
    }

    return payload;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
    throw error;
  }
}

// Generic API request function with automatic token refresh
export async function apiRequest(
  endpoint: string,
  options: AxiosRequestConfig = {},
  requireAuth: boolean = true
): Promise<AxiosResponse> {
  try {
    if (!requireAuth) {
      // For non-auth requests, create a new axios instance without interceptors
      const noAuthApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return noAuthApi.request({
        url: endpoint,
        ...options,
      });
    }

    return api.request({
      url: endpoint,
      ...options,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      let errorMessage = "Request failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.statusText) {
        errorMessage = error.response.statusText;
      } else {
        errorMessage = error.message;
      }
      throw new Error(
        `${errorMessage} (${error.response?.status || "Unknown"})`
      );
    }
    throw error;
  }
}

// Attempt to refresh the access token
async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          "x-refresh-token": refreshToken,
        },
      }
    );

    if (response.data.success) {
      // Check if new token is in response headers (backend sets this)
      const newAccessToken = response.headers["x-new-access-token"];
      if (newAccessToken) {
        await AsyncStorage.setItem("userToken", newAccessToken);
        return newAccessToken;
      }

      // Fallback: if no header, check if token is in response body
      if (response.data.accessToken) {
        await AsyncStorage.setItem("userToken", response.data.accessToken);
        return response.data.accessToken;
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
  return response.data;
}

// Helper function to update user profile
export async function updateUserProfile(profileData: any): Promise<any> {
  const response = await apiRequest("/api/common/my-profile", {
    method: "PUT",
    data: profileData,
  });
  return response.data;
}

// Helper function to update user password
export async function updatePasswordRequest(params: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> {
  const response = await apiRequest("/api/common/my-profile", {
    method: "PATCH",
    data: params,
  });
  return response.data;
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
    `/api/common/manage-org-page-data/${orgId}`
  );
  return response.data;
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
    `/api/common/manage-org-page-data/${orgId}?${params.toString()}`
  );
  
  return response.data;
}

// Utility function to logout and clear all tokens
export async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint if token exists
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      await api.post("/api/auth/logout");
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
  try {
    const response: AxiosResponse<SignUpResponse> = await api.post(
      "/api/auth/signup",
      userData
    );

    const payload = response.data;
    if (!payload.success) {
      throw new Error(payload.message || "Signup failed");
    }

    return payload;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || "Signup failed";
      throw new Error(message);
    }
    throw error;
  }
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
    data: orgData,
  });
  return response.data;
}

// Organisation helpers
export async function getOrganisationById(orgId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const response = await apiRequest(`/api/organisations/${orgId}`);
  return response.data;
}

// Update Organisation API Call
export async function updateOrganisationRequest(
  orgId: string,
  orgData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    logo?: { uri: string; name: string; type: string } | null;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const formData = new FormData();

  if (orgData.name) formData.append("name", orgData.name);
  if (orgData.email) formData.append("email", orgData.email);
  if (orgData.phone) formData.append("phone", orgData.phone);
  if (orgData.address) formData.append("address", orgData.address);

  // Handle logo: if null/undefined, remove logo; if object, upload new logo
  if (orgData.logo === null || orgData.logo === undefined) {
    formData.append("logoUrl", ""); // Remove logo
  } else if (orgData.logo) {
    formData.append("logo", orgData.logo as unknown as any);
  }

  try {
    const response = await api.put(`/api/organisations/${orgId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message:
            error.response?.statusText || "Failed to update organisation",
        }
      );
    }
    throw error;
  }
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
    data: { supervisorPhone },
  });
  return response.data;
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

  try {
    const response = await api.post(
      "/api/organisations/create-supervisor",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to create supervisor",
        }
      );
    }
    throw error;
  }
}

// Create Labour API Call
export async function createLabourRequest(labourData: {
  fName: string;
  lName: string;
  phone: string;
  profilePic?: { uri: string; name: string; type: string };
  documentsUrl?: string[];
  work: string;
}): Promise<{
  success: boolean;
  message: string;
  action?: string;
  data?: any;
}> {
  const formData = new FormData();
  formData.append("fName", labourData.fName);
  formData.append("lName", labourData.lName);
  formData.append("phone", labourData.phone);
  formData.append("work", labourData.work);

  if (labourData.profilePic) {
    formData.append("profilePic", labourData.profilePic as unknown as any);
  }

  if (labourData.documentsUrl && labourData.documentsUrl.length > 0) {
    labourData.documentsUrl.forEach((url, index) => {
      // Convert URI to file object for FormData
      const filename = url.split("/").pop() || `document_${index}.jpg`;
      const file = {
        uri: url,
        name: filename,
        type: "image/jpeg", // Default type, could be made dynamic
      } as any;
      formData.append(`documentsUrl`, file);
    });
  }

  try {
    const response = await api.post(
      "/api/organisations/create-labour",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to create labour",
        }
      );
    }
    throw error;
  }
}

// Add Labour to Organisation API Call
export async function addLabourToOrganisation(labourPhone: string): Promise<{
  success: boolean;
  message: string;
  action?: string;
  data?: any;
}> {
  const response = await apiRequest("/api/organisations/add-labour", {
    method: "POST",
    data: { labourPhone },
  });
  return response.data;
}

// Create Vendor API Call
export async function createVendorRequest(vendorData: {
  vendorName: string;
  contactPerson: string;
  phoneNo: string;
  address: string;
  services?: string[];
  gstNumber?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const response = await apiRequest("/api/common/vendors", {
    method: "POST",
    data: vendorData,
  });
  return response.data;
}

// Get Services API Call
export async function getServicesRequest(): Promise<{
  success: boolean;
  message: string;
  data?: any[];
}> {
  const response = await apiRequest("/api/common/services");
  return response.data;
}

// Add Service API Call
export async function addServiceRequest(serviceData: {
  serviceName: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const response = await apiRequest("/api/common/add-service", {
    method: "POST",
    data: serviceData,
  });
  return response.data;
}

// Edit Labour API Call
export async function editLabourRequest(
  labourId: string,
  labourData: {
    fName: string;
    lName: string;
    phone: string;
    work: string;
    profilePic?: { uri: string; name: string; type: string } | null;
    documentsUrl?: { uri: string; name: string; type: string }[] | null;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const formData = new FormData();
  formData.append("fName", labourData.fName);
  formData.append("lName", labourData.lName);
  formData.append("phone", labourData.phone);
  formData.append("work", labourData.work);

  // Handle profile picture: if null, remove; if object, upload new; if undefined, keep existing
  if (labourData.profilePic === null) {
    // Remove profile picture (send empty string to indicate removal)
    formData.append("profilePic", "");
  } else if (labourData.profilePic) {
    formData.append("profilePic", labourData.profilePic as unknown as any);
  }

  // Handle documents: if null, remove all; if array, upload new; if undefined, keep existing
  if (labourData.documentsUrl === null) {
    // Remove all documents (send empty string to indicate removal)
    formData.append("documentsUrl", "");
  } else if (labourData.documentsUrl && labourData.documentsUrl.length > 0) {
    labourData.documentsUrl.forEach((doc, index) => {
      const filename = doc.name || `document_${index}.jpg`;
      const file = {
        uri: doc.uri,
        name: filename,
        type: doc.type || "image/jpeg",
      } as any;
      formData.append("documentsUrl", file);
    });
  }

  try {
    const response = await api.put(
      `/api/organisations/edit-labour/${labourId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to edit labour",
        }
      );
    }
    throw error;
  }
}

// Get Labour by ID API Call
export async function getLabourById(labourId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.get(`/api/common/labour/${labourId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message:
            error.response?.statusText || "Failed to fetch labour details",
        }
      );
    }
    throw error;
  }
}

// Delete Labour API Call
export async function deleteLabourRequest(labourId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.delete(
      `/api/organisations/delete-labour/${labourId}`
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to delete labour",
        }
      );
    }
    throw error;
  }
}

// Get Supervisor by ID API Call
export async function getSupervisorById(supervisorId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.get(`/api/common/supervisor/${supervisorId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message:
            error.response?.statusText || "Failed to fetch supervisor details",
        }
      );
    }
    throw error;
  }
}

// Get Vendor by ID API Call
export async function getVendorById(vendorId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.get(`/api/common/vendor/${vendorId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message:
            error.response?.statusText || "Failed to fetch vendor details",
        }
      );
    }
    throw error;
  }
}

// Edit Vendor API Call
export async function editVendorRequest(
  vendorId: string,
  vendorData: {
    vendorName: string;
    contactPerson: string;
    phoneNo: string;
    address: string;
    services?: string[];
    gstNumber?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.put(
      `/api/common/vendors/${vendorId}`,
      vendorData
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to update vendor",
        }
      );
    }
    throw error;
  }
}

// Delete Vendor API Call
export async function deleteVendorRequest(vendorId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.delete(`/api/common/vendors/${vendorId}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to delete vendor",
        }
      );
    }
    throw error;
  }
}

// Delete Supervisor API Call
export async function deleteSupervisorRequest(supervisorId: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.delete(
      `/api/common/supervisors/${supervisorId}`
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to delete supervisor",
        }
      );
    }
    throw error;
  }
}

export async function getSites(orgId: string): Promise<Sites[]> {
  try {
    const response = await apiRequest(`/api/common/siteslist/${orgId}`);
    const result = response.data;

    if (!result.success) {
      throw new Error(result.message || "API request failed");
    }

    return result.data; // ✅ return only the array
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch sites");
  }
}

// Create Site API Call
export async function createSiteRequest(siteData: {
  name: string;
  address: string;
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  customerName: string;
  orgId: string;
  supervisors?: string[];
  labours?: string[];
}): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.post("/api/promoter/site", siteData);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.response?.statusText || "Failed to create site",
        }
      );
    }
    throw error;
  }
}

// Add Supervisors to Site API Call
export async function addSupervisorsToSite(
  siteId: string,
  supervisorIds: string[],
  orgId: string
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const response = await api.put(`/api/promoter/site/${siteId}`, {
      supervisors: supervisorIds,
      orgId: orgId,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message:
            error.response?.statusText || "Failed to add supervisors to site",
        }
      );
    }
    throw error;
  }
}
