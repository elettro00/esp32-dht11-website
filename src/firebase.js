import { initializeApp } from "firebase/app";
// Required for side-effects
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  //your firebase config
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const rtDb = getDatabase(app, //your firebase database link "");
