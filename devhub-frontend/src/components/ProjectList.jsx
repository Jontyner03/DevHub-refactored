import Project from "./Project";

export default function ProjectList({ projects, technologyIcons, showDeleteButton, onDelete }) {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Project
          key={project._id}
          project={project}
          technologyIcons={technologyIcons}
          showDeleteButton={showDeleteButton}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
