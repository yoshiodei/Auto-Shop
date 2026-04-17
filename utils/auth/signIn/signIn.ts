import { validateSignInCredentials } from "./validateSignInCredentials";
import { firebaseSignIn }            from "./firebaseSignIn";
import { fetchFirestoreProfile }     from "./fetchFirestoreProfile";
import { generateAndStoreJWT } from "../generateJWT";
import { useAppStore } from "@/store/app-store";
// import { useAuthStore }              from "@/store/authStore";

type SignInCredentials = {
  email: string;
  password: string;
};

export const signIn = async (credentials: SignInCredentials): Promise<void> => {
  const { email, password } = credentials;

  // 1. Validate inputs
  const validationError = validateSignInCredentials(credentials);
  if (validationError) throw new Error(validationError);

  // 2. Sign in with Firebase Auth
  const firebaseUser = await firebaseSignIn(email, password);

  // 3. Fetch full profile from Firestore
  const profile = await fetchFirestoreProfile(firebaseUser.uid);

  // 4. Generate and store JWT
//   const token = await generateAndStoreJWT(firebaseUser);

  // 5. Save full user + token to Zustand
  useAppStore.getState().setUser({ 
    uid: profile.uid,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile?.phone || null,
    location: profile?.location || null,
    createdAt: profile.createdAt,
    role: profile?.role || 'user',
    provider: profile?.provider || 'email',
});
};