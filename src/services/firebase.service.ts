import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import dotenv from 'dotenv';

dotenv.config();
if(process.env.NODE_ENV !== 'production') dotenv.config({ path: `.env.local`, override: true });

const {
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGINGSENDERID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} = process.env;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);