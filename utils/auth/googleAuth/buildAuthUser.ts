import type { User } from "firebase/auth";

interface AuthUser {
    uid: string,
    fullName: string,
    email: string,
    phone: string | null,
    location: string | null,
    provider: string,
    role: 'user' | 'admin'
    createdAt: any
}

export const buildAuthUser = (user: User, timestamp: any): AuthUser => ({
  uid:      user.uid,
  fullName: user.displayName  ?? "",
  email:    user.email?.toLowerCase() ?? "",
  phone:    user.phoneNumber  ?? null,
  location: null,
  provider: "google",
  role:    'user', // default role for Google users
  createdAt: timestamp
});