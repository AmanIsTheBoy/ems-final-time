// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4Fcm2LYZdY2OgxCmxo8oYO-KhplnThrY",
  authDomain: "ems2-268d5.firebaseapp.com",
  projectId: "ems2-268d5",
  storageBucket: "ems2-268d5.firebasestorage.app",
  messagingSenderId: "549683870240",
  appId: "1:549683870240:web:9987fe02bf5f0872c65a45",
  measurementId: "G-3R42CTJ0G8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

