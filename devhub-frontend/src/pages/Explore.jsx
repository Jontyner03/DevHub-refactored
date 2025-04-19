import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import SearchProjectList from "../components/SearchProjectList";

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 


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
      finally {
        setLoading(false); // Stop loading after fetching
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg my-14" >
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Explore Projects</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div> 
        </div>
      ) : projects.length === 0 ? (
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