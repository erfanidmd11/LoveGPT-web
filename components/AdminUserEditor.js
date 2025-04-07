import { useState } from "react";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminUserEditor() {
  const [uid, setUid] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [status, setStatus] = useState("");

  async function fetchUser() {
    setStatus("Looking up user...");
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUser(snap.data());
        setPhone(snap.data().phoneNumber);
        setStatus("User found.");
      } else {
        setUser(null);
        setStatus("User not found.");
      }
    } catch (err) {
      setStatus("Error fetching user.");
    }
  }

  async function updatePhone() {
    setStatus("Updating phone number...");
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        phoneNumber: newPhone,
        adminEditedPhone: true,
      });

      const logRef = collection(db, "logs");
      await addDoc(logRef, {
        user_uid: uid,
        old_phone: phone,
        new_phone: newPhone,
        edited_by: "super_admin",
        editedAt: serverTimestamp(),
      });

      setStatus("Phone number updated successfully.");
    } catch (err) {
      setStatus("Failed to update phone.");
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="User UID"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        className="border px-4 py-2 mr-2"
      />
      <button onClick={fetchUser} className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch User
      </button>

      {user && (
        <div className="mt-4">
          <p>Current Phone: {phone}</p>
          <input
            type="text"
            placeholder="New phone number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="border px-4 py-2 mt-2"
          />
          <button onClick={updatePhone} className="bg-green-600 text-white px-4 py-2 mt-2 ml-2 rounded">
            Update Phone
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
