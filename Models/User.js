const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    roles: { type: [String], required: true },
    dateOfBirth: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    isActive: { type: Boolean, default: false },
    address: {
        country: { type: String },
        city: { type: String }
    },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedPosts: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
