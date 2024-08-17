// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Corrected import function name

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA74-YOU3fX0UR4tCBQE3WZOfTQH6haWk4",
  authDomain: "flashcardsaas-bfd6b.firebaseapp.com",
  projectId: "flashcardsaas-bfd6b",
  storageBucket: "flashcardsaas-bfd6b.appspot.com",
  messagingSenderId: "499577096610",
  appId: "1:499577096610:web:3cd17876bb87e4bfc18afb",
  measurementId: "G-DY4C3VQTYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Corrected function call to getFirestore

export { db };