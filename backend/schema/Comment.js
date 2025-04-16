import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, //Ref to the project
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Ref to the user
    content: { type: String, required: true }, //Comment text
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);