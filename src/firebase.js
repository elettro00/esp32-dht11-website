import { initializeApp } from "firebase/app";
// Required for side-effects
import { getDatabase } from "firebase/database";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1Fj9hHYh7lZMje_DbFdVnhvadJCINkrU",
  authDomain: "esp32-monitoraggiosensori.firebaseapp.com",
  projectId: "esp32-monitoraggiosensori",
  storageBucket: "esp32-monitoraggiosensori.appspot.com",
  messagingSenderId: "371820595202",
  appId: "1:371820595202:web:13082103809a3596e97f1b",
  databaseUrl: "https://esp32-monitoraggiosensori-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const rtDb = getDatabase(app, "https://esp32-monitoraggiosensori-default-rtdb.europe-west1.firebasedatabase.app");