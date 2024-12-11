const mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectId;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, required: true },
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                comment: { type: String, required: true }
            },
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model('Post', postSchema);
