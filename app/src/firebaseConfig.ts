import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvBjTsM7QmWj2NMeGnvMxOmWcFLQvS5Tw",
  authDomain: "jobquest-79e85.firebaseapp.com",
  projectId: "jobquest-79e85",
  storageBucket: "jobquest-79e85.firebasestorage.app",
  messagingSenderId: "827449900536",
  appId: "1:827449900536:web:c549480c887f9174966a0d"
};

// これが「エクスポート」です。これがないと他のファイルから使えません！
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);