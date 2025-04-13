import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

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
    fetchProjects();
  }, []);

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
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project._id} className="border border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">{project.title}</h2>
              <p className="text-gray-300 mb-4">{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Project ↗
                </a>
              )}
              {project.image && (
                <img
                  src={project.image}
                  alt="Project"
                  className="w-full h-auto object-contain rounded-lg mt-4"
                />
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-400">Technologies:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech) => (
                    <div key={tech} className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full shadow">
                      {technologyIcons[tech] && (
                        <img src={technologyIcons[tech]} alt={tech} className="w-4 h-4 mr-2" />
                      )}
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-400">Categories:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.categories.map((category) => (
                    <span key={category} className="bg-blue-500 text-white px-3 py-1 rounded-full shadow">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}