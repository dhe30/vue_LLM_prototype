// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfonClMXcSS3OLdfyZTmraxtSfLBZ5-2c",
  authDomain: "vue-firestore-cd18b.firebaseapp.com",
  projectId: "vue-firestore-cd18b",
  storageBucket: "vue-firestore-cd18b.appspot.com",
  messagingSenderId: "930851007410",
  appId: "1:930851007410:web:dc5a74075b78acd34a12ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }