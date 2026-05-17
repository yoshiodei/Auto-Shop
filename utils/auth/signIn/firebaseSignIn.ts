import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const firebaseSignIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log("passed", userCredential.user);
  if(userCredential.user.uid === "xzI72R1u55QaURfXybMYj4htJnf1") {
    return {...userCredential.user, uid: "main-admin-id"};
  }
  return userCredential.user;
};