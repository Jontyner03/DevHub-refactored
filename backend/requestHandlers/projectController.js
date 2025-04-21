import Project from '../schema/Project.js';
import { cloudinary } from "../config/cloudinary.js";
import User from '../schema/User.js';

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
    await User.findByIdAndUpdate(req.user._id, { $inc: { projectCount: 1 } });

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
  const projectId = req.params.id;//project id from url params
  const userId = req.user._id; //user id from auth middleware; gaurantee security despite weak auth in rendering access to delete endpoint 

  try {
    console.log(`Attempting to delete project with ID: ${projectId}`);

    const project = await Project.findById(projectId);

    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }

    //Ensure the user is the owner of the project
    if (project.user.toString() !== userId.toString()) {
      console.error("Unauthorized to delete this project");
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }

    console.log("User authorized to delete the project");

    //Delete the image from cloudinary if present 
    if (project.image) {
      const publicId = project.image.split('/').pop().split('.')[0]; //get public id from url
      console.log(`Image URL: ${project.image}`);
      try {
        console.log(`Deleting image from Cloudinary with public ID: ${publicId}`);
        await cloudinary.uploader.destroy(publicId); //delete image from cloudinary
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
        return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
      }
    }

    console.log("Deleting project from db");
    await project.deleteOne(); 
    await User.findByIdAndUpdate(userId, { $inc: { projectCount: -1 } });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

//fetch user proj's for dashboard
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate("user", "name email") //Populate user details
      .sort({ createdAt: -1 });
    res.json(projects);
    //console.log(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load projects" });
  }
};

export const pinProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.pinnedProjects.includes(projectId)) {
      if (user.pinnedProjects.length >= 3) {
        return res.status(400).json({ message: "You can only pin up to 3 projects." });
      }
      user.pinnedProjects.push(projectId);
    } else {
      user.pinnedProjects = user.pinnedProjects.filter((id) => id.toString() !== projectId);
    }

    await user.save();
    res.json({ message: "Pinned projects updated", pinnedProjects: user.pinnedProjects });
  } catch (err) {
    res.status(500).json({ message: "Failed to update pinned projects" });
  }
};


//fetch all proj for explore page 
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("user", "name email") //add user details to projects in respone 
      .sort({ createdAt: -1 });
    res.json(projects);
    //console.log(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
