export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.243.117.112:8000";

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

export async function signInRequest(email: string, password: string): Promise<SignInResponse> {
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


export async function signupRequest(
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

export async function signUpRequest(userData: {
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