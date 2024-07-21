import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyAPoiKl_uSXom8rYhQ8X2BOr2YfbkeU1ts",

  authDomain: "sillies2024.firebaseapp.com",

  databaseURL: "https://sillies2024-default-rtdb.firebaseio.com",

  projectId: "sillies2024",

  storageBucket: "sillies2024.appspot.com",

  messagingSenderId: "268125004352",

  appId: "1:268125004352:web:6b75335a960a98109cf5a5",

  measurementId: "G-ZZH7FDRV0C"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Initialize Storage

export { auth, firestore, storage }; // Export storage
