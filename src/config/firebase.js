// Firebase 설정 - Master Valley
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

// Firebase 설정값 (Firebase Console에서 가져옴)
const firebaseConfig = {
  apiKey: "AIzaSyAHS1Cc22GBv7lQsdiYFU9sSwrUpqs-O9o",
  authDomain: "master-valley.firebaseapp.com",
  projectId: "master-valley",
  storageBucket: "master-valley.firebasestorage.app",
  messagingSenderId: "539777702177",
  appId: "1:539777702177:web:eca68b08d00f3d97dc866d",
  measurementId: "G-DZ6N09NZ25"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 로그인 제공자
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { auth, googleProvider, appleProvider };
export default app;
