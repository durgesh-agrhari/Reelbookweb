import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8zMrgJNjZaHATD--OJTOZmgNZKVbDnlg",
  authDomain: "reelbookna.firebaseapp.com",
  projectId: "reelbookna",
  storageBucket: "reelbookna.appspot.com",
  messagingSenderId: "371682912203",
  appId: "1:371682912203:web:22fca79b7a318f6a4df84e",
  measurementId: "G-KFC273CX32"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}


// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import {getAuth, GoogleAuthProvider} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyC8zMrgJNjZaHATD--OJTOZmgNZKVbDnlg",
//   authDomain: "reelbookna.firebaseapp.com",
//   projectId: "reelbookna",
//   storageBucket: "reelbookna.firebasestorage.app",
//   messagingSenderId: "371682912203",
//   appId: "1:371682912203:web:22fca79b7a318f6a4df84e",
//   measurementId: "G-KFC273CX32"
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);
// export const auth = getAuth(app)
// console.log("data geting from auth data", auth)
// export const googleProvider = new GoogleAuthProvider()