import Project from "./Project";

export default function ProjectList({ projects, favorites, technologyIcons, showDeleteButton, onDelete, onFavoriteToggle }) {
  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <Project
          key={project._id}
          project={project}
          isFavorite={favorites.includes(project._id)} //set initial state based on proj in favorites prop
          technologyIcons={technologyIcons}
          showDeleteButton={showDeleteButton}
          onDelete={onDelete}
          onFavoriteToggle={onFavoriteToggle} //pass the toggle handler to communicate with Dashboard.jsx
        />
      ))}
    </div>
  );
}
