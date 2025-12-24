// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQkTIgKLeO457A674hxJoYaHBilKKfDQ0",
  authDomain: "budgetbee-e35b2.firebaseapp.com",
  projectId: "budgetbee-e35b2",
  storageBucket: "budgetbee-e35b2.firebasestorage.app",
  messagingSenderId: "453878184310",
  appId: "1:453878184310:web:5de71e0cf62d2ca2f92257",
  measurementId: "G-51G72QYEVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
