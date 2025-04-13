import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import TagSelector from "../components/ProjectTagSelector";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const availableTags = [
    { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    { name: "CSS", icon: "https://cdn.simpleicons.org/css3/1572B6" },
    { name: "HTML", icon: "https://cdn.simpleicons.org/html5/E34F26" },
    { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
    { name: "Express", icon: "https://cdn.simpleicons.org/express/000000" },
    { name: "TailwindCSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { name: "Django", icon: "https://cdn.simpleicons.org/django/092E20" },
    { name: "Flask", icon: "https://cdn.simpleicons.org/flask/000000" },
    { name: "Java", icon: "https://cdn.simpleicons.org/java/007396" },
    { name: "Spring", icon: "https://cdn.simpleicons.org/spring/6DB33F" },
    { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
    { name: "C#", icon: "https://cdn.simpleicons.org/csharp/239120" },
    { name: "Ruby", icon: "https://cdn.simpleicons.org/ruby/CC342D" },
    { name: "Rails", icon: "https://cdn.simpleicons.org/rubyonrails/CC0000" },
    { name: "PHP", icon: "https://cdn.simpleicons.org/php/777BB4" },
    { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
    { name: "Go", icon: "https://cdn.simpleicons.org/go/00ADD8" },
    { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes/326CE5" },
    { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "AWS", icon: "https://cdn.simpleicons.org/amazonaws/FF9900" },
    { name: "Azure", icon: "https://cdn.simpleicons.org/microsoftazure/0078D4" },
    { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
    { name: "GraphQL", icon: "https://cdn.simpleicons.org/graphql/E10098" },
    { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
    { name: "Rust", icon: "https://cdn.simpleicons.org/rust/000000" },
    { name: "Angular", icon: "https://cdn.simpleicons.org/angular/DD0031" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Linux", icon: "https://cdn.simpleicons.org/linux/FCC624" },
    { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
    { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
    { name: "Flutter", icon: "https://cdn.simpleicons.org/flutter/02569B" },
    { name: "iOS", icon: "https://cdn.simpleicons.org/apple/000000" },
    { name: "Android", icon: "https://cdn.simpleicons.org/android/3DDC84" },
  ];

  const availableCategories = [
    { name: "#webdev" },
    { name: "#systems" },
    { name: "#fullstack" },
    { name: "#cloud" },
    { name: "#security" },
    { name: "#frontend" },
    { name: "#backend" },
    { name: "#mobile" },
    { name: "#devops" },
    { name: "#machinelearning" },
    { name: "#ai" },
    { name: "#data" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    if (image) {
      formData.append("image", image);
    }
    formData.append("technologies", tags.map((tag) => tag.name).join(",")); // Add tags
    formData.append("categories", categories.map((category) => category.name).join(",")); // Add categories

    try {
      await axiosInstance.post("/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Project Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-contain rounded-lg mt-4"
          />
        )}
        <label className="block mb-2 text-gray-400">Upload Project Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-400"
        />
        <TagSelector
          availableTags={availableTags}
          selectedTags={tags}
          setSelectedTags={setTags}
        />
        <TagSelector
          availableTags={availableCategories}
          selectedTags={categories}
          setSelectedTags={setCategories}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}