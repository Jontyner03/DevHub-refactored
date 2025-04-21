import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    linkedin: "",
    github: "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const bioTextareaRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setUser(res.data);
        setFormData({
          bio: res.data.bio || "",
          linkedin: res.data.linkedin || "",
          github: res.data.github || "",
          profileImage: null,
        });
        setPreviewImage(res.data.profileImage);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {

    if (isEditing && bioTextareaRef.current) {
      bioTextareaRef.current.style.height = "auto";
      bioTextareaRef.current.style.height = `${bioTextareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, formData.bio]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("bio", formData.bio);
    data.append("linkedin", formData.linkedin);
    data.append("github", formData.github);
    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      const res = await axiosInstance.put("/users/update-profile", data);
      setUser(res.data.user);
      setPreviewImage(res.data.user.profileImage);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err.response?.data || err.message);
    }
  };

  const joinedDate = user ? new Date(user.createdAt).toLocaleDateString() : "";
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-800 my-14">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text inline-block">
        Profile
      </h1>
      <div className="bg-gray-900 rounded shadow p-6 space-y-6 text-white">
        {previewImage && (
          <div className="flex justify-center mb-6">
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>
        )}
        <h2 className="text-2xl font-semibold text-center">{user.name || "User Name"}</h2>
        <p className="text-gray-300 text-center">Joined on: {joinedDate}</p>
        {!isEditing ? (
          <>
            <div className="border-b border-gray-700 pb-4">
              <h3 className="text-xl font-semibold mb-2">Bio</h3>
              <p className="text-gray-300">{user.bio || "No bio added yet."}</p>
            </div>
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-2">Social Links</h3>
              <div className="space-y-2">
                {user.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {user.github && (
                  <a
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub Profile
                  </a>
                )}
                {!user.linkedin && !user.github && (
                  <p className="text-gray-300">No social links provided.</p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              {/* Add the link to the PublicProfile page */}
              <Link
                to={`/profile/${user._id}`}
                className="text-blue-500 hover:underline text-sm"
              >
                Check out how others see you
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                ref={bioTextareaRef}
                className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                style={{ height: "auto" }}
              />
            </div>
            <div>
              <label className="block text-gray-400">LinkedIn Username</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400">GitHub Username</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-white"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}