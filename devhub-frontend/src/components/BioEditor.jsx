import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function BioEditor({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || "");

  const handleBioSave = async () => {
    try {
      await axiosInstance.put("/users/me", { bio: bioInput });
      setUser((prev) => ({ ...prev, bio: bioInput }));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update bio.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Bio</h2>
      {editing ? (
        <div>
          <textarea
            className="w-full border p-2 rounded text-black"
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
          <button
            onClick={handleBioSave}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <p>{user.bio || "No bio added yet."}</p>
          <button
            onClick={() => setEditing(true)}
            className="text-blue-200 mt-1 underline"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}