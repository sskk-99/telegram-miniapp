// src/App.js
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore";

const App = () => {
  const [username, setUsername] = useState("");
  const [refCount, setRefCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const user = tg.initDataUnsafe?.user;
    if (user?.username) {
      const uname = user.username;
      setUsername(uname);
      setReferralLink(`${window.location.origin}/?ref=${uname}`);
      handleUser(uname);
    }

    // Check if opened with referral
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      handleReferral(ref);
    }
  }, []);

  const handleUser = async (username) => {
    const userRef = doc(db, "users", username);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setRefCount(data.refCount || 0);
      setPoints(data.points || 0);
    } else {
      await setDoc(userRef, { refCount: 0, points: 0 });
    }
  };

  const handleReferral = async (refUsername) => {
    const refRef = doc(db, "users", refUsername);
    const refSnap = await getDoc(refRef);
    if (refSnap.exists()) {
      await updateDoc(refRef, {
        refCount: increment(1),
        points: increment(100)
      });
    } else {
      await setDoc(refRef, { refCount: 1, points: 100 });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, @{username}</h2>
      <p><strong>Referral Link:</strong> <br />{referralLink}</p>
      <p><strong>Referred:</strong> {refCount} users</p>
      <p><strong>Points:</strong> {points}</p>
    </div>
  );
};

export default App;
