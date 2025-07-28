// firebase.js

import { initializeApp } from "firebase/app"; import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

const firebaseConfig = { apiKey: process.env.REACT_APP_FIREBASE_API_KEY, authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.REACT_APP_FIREBASE_APP_ID, };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

// Create or update user with optional referral export async function createOrUpdateUser(userId, username, referredBy = null) { const userRef = doc(db, "users", userId); const userSnap = await getDoc(userRef);

if (!userSnap.exists()) { const newUser = { username, referredBy: referredBy || null, points: referredBy ? 100 : 0, referrals: [], };

await setDoc(userRef, newUser);

if (referredBy) {
  const referrerRef = doc(db, "users", referredBy);
  const referrerSnap = await getDoc(referrerRef);

  if (referrerSnap.exists()) {
    await updateDoc(referrerRef, {
      points: increment(100),
      referrals: arrayUnion(userId),
    });
  } else {
    await setDoc(referrerRef, {
      username: referredBy,
      points: 100,
      referrals: [userId],
      referredBy: null,
    });
  }
}

} }

// Get user data export async function getUser(userId) { const userRef = doc(db, "users", userId); const userSnap = await getDoc(userRef); return userSnap.exists() ? userSnap.data() : null; }

export { db };

