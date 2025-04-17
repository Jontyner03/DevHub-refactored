import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import SearchProjectList from "../components/SearchProjectList";

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    //Check if the user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchAllProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error loading global feed", err);
      }
    };

    const fetchFavorites = async () => {
      //if user is logged, in fetch favorites
      if (token) {
        try {
          const res = await axiosInstance.get("/users/favorite/me");
          setFavorites(res.data.map((project) => project._id));
        } catch (err) {
          console.error("Failed to load favorites", err);
        }
      }
    };

    fetchAllProjects();
    fetchFavorites();
  }, []);

  //Refresh the project list with the latest comments when a new comment is added
  const refreshProjects = async (projectId) => {
    try {
      const res = await axiosInstance.get(`/comments/${projectId}?limit=2`);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, comments: res.data.comments, hasMoreComments: res.data.hasMore }
            : project
        )
      );
        } catch (err) {
      console.error("Failed to refresh project comments", err);
    }
  };

  const handleFavoriteToggle = async (projectId) => {
    try {
      await axiosInstance.put(`/users/favorite/${projectId}`);
      setFavorites((prevFavorites) =>
        prevFavorites.includes(projectId)
          ? prevFavorites.filter((id) => id !== projectId)
          : [...prevFavorites, projectId]
      );
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">Explore Projects</h1>
      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found.</p>
      ) : (
        <SearchProjectList
          projects={projects}
          favorites={isLoggedIn ? favorites : []}
          technologyIcons={technologyIcons}
          showDeleteButton={false}
          onFavoriteToggle={isLoggedIn ? handleFavoriteToggle : null} //Pass toggle handler if logged in
          isLoggedIn={isLoggedIn} 
          refreshProjects={refreshProjects} //pass refresh to signal comment added
        />
      )}
      {!isLoggedIn && (
        <p className="text-gray-400 mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>{" "}
          to favorite projects.
        </p>
      )}
    </div>
  );
}