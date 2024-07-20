import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPoiKl_uSXom8rYhQ8X2BOr2YfbkeU1ts",
  authDomain: "sillies2024.firebaseapp.com",
  projectId: "sillies2024",
  storageBucket: "sillies2024.appspot.com",
  messagingSenderId: "268125004352",
  appId: "1:268125004352:web:6b75335a960a98109cf5a5",
  measurementId: "G-ZZH7FDRV0C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
