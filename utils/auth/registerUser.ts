import { validateRegisterCredentials } from "./validation";
import { userExists }             from "./checkUserExists";
import { createFirebaseUser }          from "./saveUserToFirebaseAuth";
import { saveUserToFirestore }         from "./saveUserToFirestore";
// import { generateAndStoreJWT }         from "./generateJWT";
import { useAppStore }                from "@/store/app-store";
import { showToast } from "@/context/ShowToast";
import { serverTimestamp } from "firebase/firestore";


type RegisterCredentials = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
};

export const registerUser = async (credentials: RegisterCredentials): Promise<void> => {
  const { fullName, email, phone, location, password, role } = credentials;

  // 1. Validate inputs
  const validationError = validateRegisterCredentials(credentials);
  if (!validationError?.isValid){
    showToast('Invalid registration data.','error')
    throw new Error(validationError.error || "Invalid registration data.");
  } 

  // 2. Check if user already exists
  const exists = await userExists(email);
  if (exists){
    showToast('An account with this email already exists.','error')
    throw new Error("An account with this email already exists.");
  }

  // 3. Create user in Firebase Auth
  const firebaseUser = await createFirebaseUser(fullName, email, password);

  const timeStamp = serverTimestamp();

  // 4. Save user profile to Firestore
  await saveUserToFirestore({
    uid: firebaseUser.uid,
    fullName,
    email,
    phone,
    location,
    role,
    timeStamp
  });

  // 5. Generate and store JWT
  // const token = await generateAndStoreJWT(firebaseUser);

  // 6. Save user to Zustand store
  useAppStore.getState().setUser({
    uid: firebaseUser.uid,
    fullName,
    email,
    phone: phone ?? null,
    location: location ?? null,
    role,
    createdAt: timeStamp,
  });
};