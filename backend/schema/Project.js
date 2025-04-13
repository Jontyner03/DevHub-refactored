import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String }, //link to the project (GitHub, live demo, etc.)
  image: { type: String },
  technologies: [{ type: String }], //tags/tech used in project (languages, frameworks, etc.)
  categories: [{ type: String }], //categories of the project (web, mobile, etc.)
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);