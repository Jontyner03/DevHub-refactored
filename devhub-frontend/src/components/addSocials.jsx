import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AddSocials({ user, setUser }) {
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [github, setGithub] = useState(user?.github || "");
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put("/users/socials", { linkedin, github });
      setUser((prev) => ({ ...prev, linkedin: res.data.linkedin, github: res.data.github }));
      alert("Social links updated successfully!");
    } catch (err) {
      setError("Failed to update social links.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Social Links</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-400">LinkedIn Username</label>
          <input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="LinkedIn username"
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-400">GitHub Username</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub username"
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
