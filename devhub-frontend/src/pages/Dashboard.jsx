import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import ProjectList from "../components/ProjectList";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]); //State to hold favorite projects
  //////CHANGES TO HANDLE FAVORITES///////
  //use effect to fetch favorite project ids from api/favorites/me 
  //pass to project list 
  //projects list passes isFavorite prop to project component with the value of project._id in favorites array
  //if project._id is in favorites array, set isFavorite to true, else false

  //in proj component, clicking favprite triggers handleFavoriteToggle and sends a put request to api/users/favorite/:id
  //When project is favorited/unfavorited, it will be added to the favorites array in the backend and the Dashboard will update fetchFavorites to include/rmv the project
  

    const technologyIcons = {
    React: "https://cdn.simpleicons.org/react/61DAFB",
    JavaScript: "https://cdn.simpleicons.org/javascript/F7DF1E",
    "Node.js": "https://cdn.simpleicons.org/nodedotjs/339933",
    CSS: "https://cdn.simpleicons.org/css3/1572B6",
    HTML: "https://cdn.simpleicons.org/html5/E34F26",
    MongoDB: "https://cdn.simpleicons.org/mongodb/47A248",
    Express: "https://cdn.simpleicons.org/express/000000",
    TailwindCSS: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    Python: "https://cdn.simpleicons.org/python/3776AB",
    Django: "https://cdn.simpleicons.org/django/092E20",
    Flask: "https://cdn.simpleicons.org/flask/000000",
    Java: "https://cdn.simpleicons.org/java/007396",
    Spring: "https://cdn.simpleicons.org/spring/6DB33F",
    "C++": "https://cdn.simpleicons.org/cplusplus/00599C",
    "C#": "https://cdn.simpleicons.org/csharp/239120",
    Ruby: "https://cdn.simpleicons.org/ruby/CC342D",
    Rails: "https://cdn.simpleicons.org/rubyonrails/CC0000",
    PHP: "https://cdn.simpleicons.org/php/777BB4",
    Laravel: "https://cdn.simpleicons.org/laravel/FF2D20",
    Go: "https://cdn.simpleicons.org/go/00ADD8",
    Kubernetes: "https://cdn.simpleicons.org/kubernetes/326CE5",
    Docker: "https://cdn.simpleicons.org/docker/2496ED",
    AWS: "https://cdn.simpleicons.org/amazonaws/FF9900",
    Azure: "https://cdn.simpleicons.org/microsoftazure/0078D4",
    Firebase: "https://cdn.simpleicons.org/firebase/FFCA28",
    GraphQL: "https://cdn.simpleicons.org/graphql/E10098",
    PostgreSQL: "https://cdn.simpleicons.org/postgresql/4169E1",
    MySQL: "https://cdn.simpleicons.org/mysql/4479A1",
    Rust: "https://cdn.simpleicons.org/rust/000000",
    Angular: "https://cdn.simpleicons.org/angular/DD0031",
    "Next.js": "https://cdn.simpleicons.org/nextdotjs/000000",
    TypeScript: "https://cdn.simpleicons.org/typescript/3178C6",
    Linux: "https://cdn.simpleicons.org/linux/FCC624",
    Git: "https://cdn.simpleicons.org/git/F05032",
    Vue: "https://cdn.simpleicons.org/vuedotjs/4FC08D",
    Flutter: "https://cdn.simpleicons.org/flutter/02569B",
    iOS: "https://cdn.simpleicons.org/apple/000000",
    Android: "https://cdn.simpleicons.org/android/3DDC84",
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects/me");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get("/users/favorite/me");
        setFavorites(res.data.map((project) => project._id)); // Store only the IDs
      } catch (err) {
        console.error("Failed to load favorites", err);
      }
    };

    fetchProjects();
    fetchFavorites();
  }, []);


  const handleFavoriteToggle = async (projectId) => {
    try {
      await axiosInstance.put(`/users/favorite/${projectId}`);
      setFavorites((prevFavorites) =>
        prevFavorites.includes(projectId)
          ? prevFavorites.filter((id) => id !== projectId) //rmv proj if already favorited
          : [...prevFavorites, projectId] // Add if not favorited
      );
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  const handleDelete = (projectId) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-400">My Projects</h1>
        <Link to="/create-project" className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition">
          + New Project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No projects yet.{" "}
          <Link to="/create-project" className="text-blue-400 hover:underline">
            Create one
          </Link>.
        </p>
      ) : (
        <ProjectList
          projects={projects}
          favorites={favorites}
          technologyIcons={technologyIcons}
          showDeleteButton={true}
          onDelete={handleDelete}
          onFavoriteToggle={handleFavoriteToggle} //Pass the toggle handler
        />
      )}
    </div>
  );
}