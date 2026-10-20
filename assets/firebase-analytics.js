// Taamoo Studio website analytics — shared by all top-level pages.
// Firebase web configs are public identifiers by design; access is
// restricted by authorized domains in the Firebase console.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1pyZFPfhrv706cDg47sqJlm_1aGC_ZbQ",
  authDomain: "matche-6de72.firebaseapp.com",
  databaseURL: "https://matche-6de72.firebaseio.com",
  projectId: "matche-6de72",
  storageBucket: "matche-6de72.firebasestorage.app",
  messagingSenderId: "1022870328792",
  appId: "1:1022870328792:web:7f5293552c9d5b95b90ead",
  measurementId: "G-GPWKG9M4LP"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
