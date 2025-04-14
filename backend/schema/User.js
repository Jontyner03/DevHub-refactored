const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User schema definition for MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], //Array of project IDs that the user has favorited
}, { timestamps: true });

//TO DO: Seperate user schema for auth, profile details, and basic info (name, email etc.)

//Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);