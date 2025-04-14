import { Link } from "react-router-dom";

export default function Project({ project, technologyIcons }) {
  return (
    <div className="border border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition">
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
      {project.user && (
        <p className="text-sm text-gray-400 mt-2">
          by:{" "}
          <Link to={`/u/${project.user._id}`} className="text-blue-500 hover:underline">
            {project.user.name}
          </Link>
        </p>
      )}
    </div>
  );
}
