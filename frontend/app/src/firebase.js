// Import the functions you need from the SDKs you need
import privatedata from "./secrets.mjs";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: privatedata.firebaseAPIkey,
  authDomain: "libraryapplication-b5ac0.firebaseapp.com",
  projectId: "libraryapplication-b5ac0",
  storageBucket: "libraryapplication-b5ac0.appspot.com",
  messagingSenderId: "325078680891",
  appId: "1:325078680891:web:c91c4cf4279e76f2a2631e",
  measurementId: "G-404P8HBEP0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };
