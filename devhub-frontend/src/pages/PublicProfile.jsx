import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ProjectList from "../components/ProjectList";

export default function PublicProfile() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

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

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/public/${id}`);
        setUser(res.data.user);
        setProjects(res.data.projects);
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

  const handleDeleteProject = async (projectId) => {
    try {
      await axiosInstance.delete(`/projects/delete/${projectId}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  if (!user) return <p className="p-6">Loading profile...</p>;

  const isOwnProfile = currentUserId === user._id;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {user.profileImage && (
        <div className="flex justify-center mb-6">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-md"
          />
        </div>
      )}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
        <p className="text-gray-600 mb-6">{user.bio || "No bio provided."}</p>

        <div className="mb-6">
          {user.linkedin && (
            <a
              href={`https://linkedin.com/in/${user.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mr-4"
            >
              LinkedIn
            </a>
          )}
          {user.github && (
            <a
              href={`https://github.com/${user.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
          )}
        </div>

        <h2 className="text-4xl font-semibold mb-3">Projects</h2>
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          {projects.length === 0 ? (
            <p className="text-gray-400">This user hasn't added any projects yet.</p>
          ) : (
            <ProjectList
              projects={projects}
              favorites={isLoggedIn ? favorites : []}
              technologyIcons={technologyIcons}
              showDeleteButton={isOwnProfile} //Allow delete only for own profile
              onDelete={isOwnProfile ? handleDeleteProject : null}
              onFavoriteToggle={isLoggedIn ? handleFavoriteToggle : null}
              isLoggedIn={isLoggedIn}
              refreshProjects={() => {}} 
            />
          )}
        </div>
      </div>
    </div>
  );
}