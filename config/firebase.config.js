// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6gDN50QGhd-mFd4izGbRLWPC9bE5PZ9c",
  authDomain: "levelart.firebaseapp.com",
  projectId: "levelart",
  storageBucket: "levelart.appspot.com",
  messagingSenderId: "612831702411",
  appId: "1:612831702411:web:4940549eaadcf7ddee538e",
  measurementId: "G-911JRERXNL"
};



if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
// Initialize Firebase

  const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);