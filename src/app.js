import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(data);
  }

  async function handleAdd() {
    const tg = window.Telegram.WebApp;
    const username = tg?.initDataUnsafe?.user?.username || "anonymous";
    await addDoc(collection(db, "users"), { username, date: new Date() });
    fetchUsers();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Telegram Mini App</h2>
      <button onClick={handleAdd}>Add User</button>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
