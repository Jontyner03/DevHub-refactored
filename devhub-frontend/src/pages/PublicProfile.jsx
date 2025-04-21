import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
//import SearchProjectList from "../components/SearchProjectList";
import ReadOnlyProjectList from "../components/ReadOnlyProjectList";
import PinnedProjectsCarousel from "../components/PinnedProjectsCarousel";

export default function PublicProfile() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false); 

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
    const token = localStorage.getItem("token");
    document.body.style.overflow = "auto";
    setIsLoggedIn(!!token);
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(decodedToken.id);
    }
    
    //grab prof and project data by id
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/public/${id}`);
        const user = res.data.user;
        const projects = res.data.projects;
        const pinnedProjects = projects.filter((project) =>
          user.pinnedProjects.includes(project._id)
        );

        setUser(user);
        setProjects(projects);
        setPinnedProjects(pinnedProjects);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    const fetchFavorites = async () => {
      if (token) {
        try {
          const res = await axiosInstance.get("/users/favorite/me");
          setFavorites(res.data.map((project) => project._id));
        } catch (err) {
          console.error("Failed to load favorites", err);
        }
      }
    };

    fetchProfile();
    fetchFavorites();
  }, [id]);

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

  



  if (!user) return <p className="p-6">Loading profile...</p>;

  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  return (
  <div className="p-6 w-full sm:max-w-5xl mx-auto">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:justify-between mb-6">
        {/* Profile Image and Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-4 md:mb-0">
          {user.profileImage && (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-md md:mr-6 mb-4 md:mb-0"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">Joined on: {joinedDate}</p>
            <p className="text-gray-400">Projects: {projects.length}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bio-section bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full md:w-auto">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-gray-300">{user.bio || "No bio provided."}</p>
        </div>
      </div>
        {/* Socials*/}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="flex gap-4">
            {user.linkedin && (
              <a
                href={`https://linkedin.com/in/${user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {user.github && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className= "text-blue-500 hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Pinned Projects Carousel*/}
        {pinnedProjects.length > 0 && (
          <div className="mb-6">
          <PinnedProjectsCarousel
            pinnedProjects={pinnedProjects}
            favorites={favorites}
            technologyIcons={technologyIcons}
            onFavoriteToggle={isLoggedIn ? handleFavoriteToggle : null}
            isLoggedIn={isLoggedIn}
            refreshProjects={refreshProjects}
            isPinned={true} //set true default; rmv non pin 
            onPinToggle={async (projectId) => {
              try {
                // update pinned proj and refresh projects
                const res = await axiosInstance.put(`/projects/pin/${projectId}`);
                const updatedPinnedProjects = projects.filter((project) =>
                  res.data.pinnedProjects.includes(project._id)
                );
                setPinnedProjects(updatedPinnedProjects); // Update the pinnedProjects state with the response
              } catch (err) {
                console.error("Failed to update pinned projects", err);
              }
            }}
          />
          </div>
        )}
        <button
          onClick={() => setShowAllProjects((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {showAllProjects ? "Hide All Projects" : "View All Projects"}
        </button>

        {/*Show list of users projects; no toggles*/}
        {showAllProjects && (
          <div className="mt-6">
            <ReadOnlyProjectList
              projects={projects}
              technologyIcons={technologyIcons} 
            />
          </div>
        )}
      </div>
    </div>
  );
}