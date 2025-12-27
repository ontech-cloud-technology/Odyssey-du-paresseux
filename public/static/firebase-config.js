// Firebase Configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSJONgLDetXUCsCaWBalU7e_MDYi_DLKg",
  authDomain: "mimo-76d62.firebaseapp.com",
  projectId: "mimo-76d62",
  storageBucket: "mimo-76d62.firebasestorage.app",
  messagingSenderId: "23119171300",
  appId: "1:23119171300:web:9943993dfcbe9f840f26f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export for use in other modules
export { app };

