import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, firestoreDB } from "../api/firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined = still loading
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check Firestore for their role
        const userRef = doc(firestoreDB, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // Existing user — grab their role
          setRole(userSnap.data().role);
        } else {
          // First time login — create user doc with default role
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: "user",
          });
          setCurrentUser({
            ...user,
            photoURL: user.photoURL
              ? user.photoURL.replace("s96-c", "s256-c")
              : null,
          });
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setRole(null);
      }
    });

    return unsub;
  }, []);

  async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, role, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
