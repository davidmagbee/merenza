import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MESSENGER_ID
  };

// Initialize Firebase
let app;
let storage;

try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    console.log('Firebase initialized successfully with bucket:', storage.app.options.storageBucket);
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
}

export { storage, app };