import Project from "./Project";

export default function ProjectList({ projects, technologyIcons }) {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Project key={project._id} project={project} technologyIcons={technologyIcons} />
      ))}
    </div>
  );
}
