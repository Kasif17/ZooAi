import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zooai-254fb.firebaseapp.com",
  projectId: "zooai-254fb",
  storageBucket: "zooai-254fb.firebasestorage.app",
  messagingSenderId: "876427984915",
  appId: "1:876427984915:web:33b57d977785b07c96ffe6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()