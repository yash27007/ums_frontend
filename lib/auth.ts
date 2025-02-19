// import { jwtDecode } from "jwt-decode";

// export const getUser = () => {
//   const token = localStorage.getItem('token');
//   if (!token) return null;
  
//   try {
//     const decoded = jwtDecode<{ user: any }>(token);
//     console.log(decoded.user);
//     return decoded.user;
//   } catch {
//     return null;
//   }
// };

// export const setToken = (token: string) => {
//   localStorage.setItem('token', token);
// };

// export const removeToken = () => {
//   localStorage.removeItem('token');
// };

// export const getToken = () => {
//   return localStorage.getItem('token');
// };

import { jwtDecode } from "jwt-decode";

// Define the structure of the decoded JWT
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Get the stored token.
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Store the token in localStorage.
 */
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

/**
 * Remove the token from localStorage.
 */
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

/**
 * Decode the JWT token and return user details.
 */
export const getUser = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
