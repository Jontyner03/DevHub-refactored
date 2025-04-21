import User from "../schema/User.js";
import Project from '../schema/Project.js';
import sanitizeHtml from "sanitize-html";

  export const getPublicProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //fetch proj and attatch user info for proj componenets
      const projects = await Project.find({ user: userId }).populate("user", "name _id") .sort({ createdAt: -1 });
      res.json({ user, projects });
    } catch (err) {
      res.status(500).json({ message: "Failed to load profile" });
    }
  };

//REFORMATTED PROFILE UPDATING: use single func only from form in frontend
export const updateProfile = async (req, res) => {
  try {
    const { bio, linkedin, github } = req.body;

    const sanitizedBio = bio ? sanitizeHtml(bio.trim()) : "";
    const sanitizedLinkedin = linkedin ? sanitizeHtml(linkedin.trim()) : "";
    const sanitizedGithub = github ? sanitizeHtml(github.trim()) : "";

    const updates = {
      bio: sanitizedBio,
      linkedin: sanitizedLinkedin,
      github: sanitizedGithub,
    };

    if (req.file) {
      updates.profileImage = req.file.path; // Save the uploaded profile image path
    }

    //send and retriev updated user data
    const updatedUser = await User.findByIdAndUpdate( req.user._id, updates,{ new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const favoriteProject = async (req, res) => {
  const { id: projectId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    //console.log(projectId);
    if (user.favorites.includes(projectId)) {
      console.log("unfavorting project");
      user.favorites.pull(projectId); //rmv from favorites
    } else {
      console.log("favoriting project");
      user.favorites.push(projectId); //add project to favorites
    }
    
    await user.save();
    res.json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Failed to update favorites" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to load favorites" });
  }
}



