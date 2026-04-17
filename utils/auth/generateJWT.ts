import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";
// import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";

// Get and store JWT in localStorage
export const generateAndStoreJWT = async (user: User): Promise<string> => {
  const token = await getIdToken(user, true);
  localStorage.setItem("auth_token", token);
  return token;
};

// Retrieve stored JWT
export const getStoredJWT = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Clear JWT on logout
export const clearJWT = (): void => {
  localStorage.removeItem("auth_token");
};