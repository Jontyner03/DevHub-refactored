import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import BioEditor from "../components/BioEditor";
import ProfileImageUploader from "../components/pfpUpload";
import AddSocials from "../components/addSocials";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setUser(res.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {user.profileImage && (
        <div className="flex justify-center mb-6">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-md"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>

      <div className="bg-cyan-700 rounded shadow p-6 space-y-6 text-white">
        <div>
          <h2 className="text-xl font-semibold">Name</h2>
          <p>{user.name}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p>{user.email}</p>
        </div>

        <BioEditor user={user} setUser={setUser} />
        <ProfileImageUploader user={user} setUser={setUser} />
        <AddSocials user={user} setUser={setUser} />
      </div>
    </div>
  );
}