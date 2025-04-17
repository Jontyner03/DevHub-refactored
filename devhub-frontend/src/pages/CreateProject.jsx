import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import CreateProjTagSelector from "../components/CreateProjTagSelector";
import DOMPurify from "dompurify";


export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const availableTags = Object.entries({
    React: "/icons/react.svg",
    JavaScript: "/icons/javascript.svg",
    "Node.js": "/icons/nodejs.svg",
    CSS: "/icons/css.svg",
    HTML: "/icons/html.svg",
    MongoDB: "/icons/mongodb.svg",
    Express: "/icons/express.svg",
    TailwindCSS: "/icons/tailwind.svg",
    Python: "/icons/python.svg",
    Django: "/icons/django.svg",
    Flask: "/icons/flask.svg",
    Java: "/icons/icons8-java.svg",
    Spring: "/icons/spring.svg",
    "C++": "/icons/c++.svg",
    "C#": "/icons/icons8-c-sharp-logo-2.svg",
    Ruby: "/icons/ruby.svg",
    Rails: "/icons/rails.svg",
    PHP: "/icons/php.svg",
    Laravel: "/icons/laravel.svg",
    Go: "/icons/go.svg",
    Kubernetes: "/icons/kubernetes.svg",
    Docker: "/icons/docker.svg",
    AWS: "/icons/icons8-amazon-web-services.svg",
    Azure: "/icons/icons8-azure.svg",
    Firebase: "/icons/firebase.svg",
    GraphQL: "/icons/graphql.svg",
    PostgreSQL: "/icons/postgresql.svg",
    MySQL: "/icons/mysql.svg",
    Rust: "/icons/rust.svg",
    Angular: "/icons/angular.svg",
    "Next.js": "/icons/nextjs.svg",
    TypeScript: "/icons/typescript.svg",
    Linux: "/icons/linux.svg",
    Git: "/icons/git.svg",
    Vue: "/icons/vue.svg",
    Flutter: "/icons/flutter.svg",
    iOS: "/icons/ios.svg",
    Android: "/icons/android.svg",
  }).map(([name, icon]) => ({ name, icon }));


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
    { name: "#game" },
    { name: "#blockchain" },
    { name: "#opensource" },
    { name: "#ecommerce" },
    { name: "#iot" },
    { name: "#arvr" },
    { name: "#chatbot" },
    { name: "#automation" },
    { name: "#microservices" },
    { name: "#api" },
    { name: "#testing" },
    { name: "#uxui" },
    { name: "#design" },
    { name: "#analytics" },
    { name: "#networking" },
    { name: "#database" },
    { name: "#virtualization" },
    { name: "#hardware" },
    { name: "#embedded" },
    { name: "#robotics" },
    { name: "#3dprinting" },
    {name : "#helpwanted"},
    {name : "#hackathon"},
    {name : "#tutorial"},
    {name : "#learning"},
    {name : "#resources"},
    {name : "#community"},
    {name : "#events"},
    {name : "#portfolio"},
    {name : "#showcase"},
    {name : "#scripting"},
  ];

const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const isValidURL = (url) => {
    try {
      const parsedURL = new URL(url);
      return parsedURL.protocol === "https:"; //ensure the protocol is HTTPS
    } catch {
      return false;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resizedImage = await resizeImage(file, 1200, 300); //resize to wXh
      setImage(resizedImage);
      setPreview(URL.createObjectURL(resizedImage));
    }
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        //Maintain aspect ratio within maxWidth and maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (link && !isValidURL(link)) {
      alert("Please enter a valid URL for the project link.");
      return;
    }

    const formData = new FormData();
    formData.append("title", sanitizeInput(title));
    formData.append("description", sanitizeInput(description));
    formData.append("link", link);
    if (image) {
      formData.append("image", image);
    }
    formData.append("technologies", tags.map((tag) => tag.name).join(",")); //add tags as string
    formData.append("categories", categories.map((category) => category.name).join(",")); //add categories as string
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
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-lg mt-6 mb-5">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Create New Project
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-300 font-medium mb-2">Title</label>
          <input
            id="title"
            name="title"
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
            placeholder="Enter your project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-300 font-medium mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
            placeholder="Describe your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-gray-300 font-medium mb-2">Project Link</label>
          <input
            id="link"
            name="link"
            type="url"
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:p-4"
            placeholder="Enter your project link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          {!isValidURL(link) && link && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid HTTPS URL.</p>
          )}
        </div>

        <div>
          <label htmlFor="fileInput" className="block text-gray-300 font-medium mb-2">Upload Project Image</label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition sm:px-6 sm:py-3"
            >
              Choose Image
            </button>
            {image && (
              <>
                <span className="text-gray-400 text-sm sm:text-base">{image.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition sm:px-6 sm:py-3"
                >
                  Remove Image
                </button>
              </>
            )}
          </div>
          <input
            id="fileInput"
            name="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview && (
            <div className="flex justify-center items-center mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-[300px] max-h-[300px] object-contain rounded-lg shadow-md sm:max-w-[400px] sm:max-h-[400px]"
              />
            </div>
          )}
        </div>
          <CreateProjTagSelector
            availableTags={availableTags}
            selectedTags={tags}
            setSelectedTags={setTags}
            prompt={"Share your tech stack!"}
            name="techTags"
          />
          <CreateProjTagSelector
            availableTags={availableCategories}
            selectedTags={categories}
            setSelectedTags={setCategories}
            prompt={"Add some categories!"}
            name="categories"
          />

        <button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition sm:py-4"
          type="submit"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}