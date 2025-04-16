import User from "../schema/User.js";
import Project from '../schema/Project.js';
import sanitizeHtml from "sanitize-html";

export const updateMe = async (req, res) => {
    try {
      const { bio } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { bio },
        { new: true }
      ).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error updating profile" });
    }
  };

  export const getPublicProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
  
      res.json({ user, projects });
    } catch (err) {
      res.status(500).json({ message: "Failed to load profile" });
    }
  };

export const updateSocials = async (req, res) => {
  const { linkedin, github } = req.body;

  try {
    const sanitizedLinkedin = linkedin ? sanitizeHtml(linkedin.trim()) : "";
    const sanitizedGithub = github ? sanitizeHtml(github.trim()) : "";

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { linkedin: sanitizedLinkedin, github: sanitizedGithub },
      { new: true }//get val of updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ linkedin: updatedUser.linkedin, github: updatedUser.github });
  } catch (err) {
    res.status(500).json({ message: "Failed to update social links" });
  }
};

export const updateProfileImage =  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.bio = req.body.bio || user.bio;
      if (req.file) {
        user.profileImage = req.file?.path || user.profileImage;
      }
      await user.save();
      res.json({ message: "Profile updated", user });
    } catch (err) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  }

export const favoriteProject = async (req, res) => {
  const { id: projectId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(projectId);
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



