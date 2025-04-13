import Project from '../schema/Project.js';

//////CRUD PROJECT OPPS////// requires user JWT authentication provided by auth middware  
export const createProject = async (req, res) => {
  const { title, description, link, technologies, categories } = req.body;

  try {
    const newProject = new Project({
      user: req.user._id,
      title,
      description,
      link,
      image: req.file ? req.file.path : null,
      technologies: technologies ? technologies.split(",") : [], 
      categories: categories ? categories.split(",") : [], 
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: "Server error creating project" });
  }
}

//edit properties of project
export const editProject = async (req, res) => {
  const { title, description, link, technologies, categories } = req.body;
  const projectId = req.params.id;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        link,
        image: req.file ? req.file.path : null,
        technologies: technologies ? technologies.split(",") : [], 
        categories: categories ? categories.split(",") : [], 
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project" });
  }
}


//delete project
export const deleteProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project" });
  }
};



//fetch user proj's for dashboard
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects" });
  }
};


//fetch all proj for explore page 
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name email") //add user details to projects in respone 
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
