import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function PublicProfile() {
  const { id } = useParams(); // userId from URL
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/public/${id}`);
        setUser(res.data.user);
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
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

        <h2 className="text-2xl font-semibold mb-3">Projects</h2>
        {projects.length === 0 ? (
          <p>This user hasn't added any projects yet.</p>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project._id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-medium">{project.title}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    Visit Project ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}