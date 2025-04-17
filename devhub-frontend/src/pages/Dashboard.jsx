import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import ProjectList from "../components/ProjectList";

export default function Dashboard() {
  const [projects, setProjects] = useState([]); //State to hold all projects
  const [myProjects, setMyProjects] = useState([]); //State to hold user's projects
  const [favoriteProjects, setFavoriteProjects] = useState([]); //State to hold favorite projects objects
  const [favorites, setFavorites] = useState([]); //State to hold favorite projects
  const [showFavorites, setShowFavorites] = useState(false); // Toggle state for displaying lists
  

  const technologyIcons = {
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
    "C#": "/icons/icons8-c-sharp-logo-22.svg",
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
  };

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects/me"); 
        setMyProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
  
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get("/users/favorite/me");
        setFavorites(res.data.map((project) => project._id)); 
      } catch (err) {
        console.error("Failed to load favorites", err);
      }
    };
  
    const fetchAllProjects = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
  
    //fetch all projects, my projects and favorites when the component mounts
    fetchMyProjects();
    fetchFavorites();
    fetchAllProjects();
  }, []); //run once on mount
  
  useEffect(() => {
    //Update favorite projects whenever `projects` or `favorites` changes
    setFavoriteProjects(
      projects.filter((project) => favorites.includes(project._id))
    );
  }, [projects, favorites]); 

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
    setMyProjects((prevProjects) =>
      prevProjects.filter((project) => project._id !== projectId)
    );
  };
  
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
      setMyProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, comments: res.data.comments, hasMoreComments: res.data.hasMore }
            : project
        )
      );
      setFavoriteProjects((prevProjects) =>
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
  //Render another ProjectList component for list of all favoriteed projects
  //Which list is displayed [my projects or favorites] is determined by toggle 
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-400">
          {showFavorites ? "Favorite Projects" : "My Projects"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFavorites(false)}
            className={`px-4 py-2 rounded-lg shadow ${
              !showFavorites
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            } hover:bg-blue-600 transition`}
          >
            My Projects
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`px-4 py-2 rounded-lg shadow ${
              showFavorites
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            } hover:bg-blue-600 transition`}
          >
            Favorites
          </button>
        </div>
      </div>
      {showFavorites ? (
        <ProjectList
          projects={favoriteProjects}
          favorites={favorites}
          technologyIcons={technologyIcons}
          showDeleteButton={false}
          onFavoriteToggle={handleFavoriteToggle}
          isLoggedIn={true}
          refreshProjects={refreshProjects} //pass refresh to signal comment added
        />
      ) : (
        <ProjectList
          projects={myProjects}
          favorites={favorites}
          technologyIcons={technologyIcons}
          showDeleteButton={true}
          onDelete={handleDelete}
          onFavoriteToggle={handleFavoriteToggle}
          isLoggedIn={true}
          refreshProjects={refreshProjects} 
        />
      )}
    </div>
  );
}