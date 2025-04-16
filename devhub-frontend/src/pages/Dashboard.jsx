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