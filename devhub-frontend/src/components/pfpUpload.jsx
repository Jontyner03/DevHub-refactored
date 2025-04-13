import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ProfileImageUploader({ user, setUser }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      const res = await axiosInstance.put("/users/update", formData);
      setUser(res.data.user);
      setPreview(res.data.user.profileImage);
      alert("Profile image updated!");
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Profile Picture</h2>
      {preview && (
        <img
          src={preview}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-black"
      />
      <button
        onClick={handleImageUpload}
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
      >
        Upload Image
      </button>
    </div>
  );
}