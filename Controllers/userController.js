const database = require("../Middleware/mongoDB");
const LoggedUser = require('./accountController');
const Post = require("../Models/Post");
ObjectId = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

exports.deletePost = async (req, res) => {
    const db = await database.getDb();
    const posts = db.collection('posts');
    const sourcePage = req.params.sourcePage;
    const postId = req.params.postId;

    const deletedPost = await posts.deleteOne({ _id: new ObjectId(postId) });
    res.redirect(`/user/${sourcePage}`);
}

exports.addLike = async (req, res) => {
    const db = await database.getDb();
    const posts = db.collection('posts');
    const users = db.collection('users');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });

    const updatedPost = await posts.updateOne({ _id: new ObjectId(req.params.postId) }, { $inc: { likes: 1 } });
    const userLikes = user.likedPosts;
    userLikes.push(req.params.postId);
    const updatedLikes = await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { likedPosts: userLikes } });
    if (updatedLikes) {
        console.log("likes updated");
    } else {
        console.log("likes update failed");

    }
    res.redirect(`/user/${req.params.sourcePage}`);
}

exports.removeLike = async (req, res) => {
    const db = await database.getDb();
    const posts = db.collection('posts');
    const users = db.collection('users');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });

    const updatedPost = await posts.updateOne({ _id: new ObjectId(req.params.postId) }, { $inc: { likes: -1 } });
    const userLikes = user.likedPosts;

    const newLikes = userLikes.filter((like) => {
        return like.toString() != req.params.postId.toString();
    })
    const updatedLikes = await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { likedPosts: newLikes } })
    if (updatedLikes) {
        console.log("likes updated");
    } else {
        console.log("likes update failed");
    }
    res.redirect(`/user/${req.params.sourcePage}`);
}

exports.deleteComment = async (req, res) => {
    const db = await database.getDb();
    const posts = db.collection('posts');

    const sourcePage = req.params.sourcePage;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await posts.findOne({ _id: new ObjectId(postId) });
    const postComments = post.comments;

    const newComments = postComments.filter((comment) => {
        return comment._id.toString() != commentId.toString();
    })
    const updateComments = await posts.updateOne({ _id: new ObjectId(postId) }, { $set: { comments: newComments } })
    res.redirect(`/user/${req.params.sourcePage}`);
}

exports.getEditProfile = async (req, res) => {
    const db = await database.getDb();
    const users = db.collection('users');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });

    res.render('user/editProfile', { title: "Edit Profile", user: user, errors: [] })
}

exports.editProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.render('user/editProfile', {
            user: user,
            title: "Edit Profile",
            errors: errors.array().map(error => error.msg),
        })
    }
    else {
        const db = await database.getDb();
        const users = db.collection('users');

        const userName = LoggedUser.getLoggedUser();
        const user = await users.findOne({ userName: userName });

        if (user.firstName != req.body.firstName) {
            await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { firstName: req.body.firstName } })
        }
        if (user.lastName != req.body.lastName) {
            await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { lastName: req.body.lastName } })
        }
        if (user.email != req.body.email) {
            await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { email: req.body.email } })
        }
        if (user.address.city != req.body.city || user.address.country != req.body.country) {
            const address = {
                country: req.body.country,
                city: req.body.city
            }
            await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { address: address } })
        }
        if (user.password != req.body.password) {
            await users.updateOne({ _id: new ObjectId(user._id) }, { $set: { password: req.body.password } })
        }
        res.redirect("/user/profile")
    }
}

exports.getBlogger = async (req, res) => {
    const db = await database.getDb();
    const users = db.collection('users');
    const posts = db.collection('posts');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });
    const blogger = await users.findOne({ userName: req.params.bloggerUsername });

    let bloggerPosts = [];
    const allPosts = await posts.find().sort({ createdAt: -1 }).toArray();
    for (p of allPosts) {
        if (p.author.toString() == blogger._id.toString()) {
            for (comment of p.comments) {
                const user = await users.findOne({ _id: new ObjectId(comment.user) });
                comment.author = user.userName;
            }
            bloggerPosts.push(p);
        }
    }
    res.render('user/blogger', { title: "Blogger", user: user, bloggerPosts: bloggerPosts, blogger: blogger })
}

exports.getProfile = async (req, res) => {
    const db = await database.getDb();
    const users = db.collection('users');
    const posts = db.collection('posts');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });
    const userId = user._id;
    let userPosts = [];
    const allPosts = await posts.find().sort({ createdAt: -1 }).toArray();
    for (p of allPosts) {
        if (p.author.toString() == userId.toString()) {
            for (comment of p.comments) {
                const user = await users.findOne({ _id: new ObjectId(comment.user) });
                comment.author = user.userName;
            }
            userPosts.push(p);
        }
    }
    res.render('user/profile', { title: "Profile", user: user, userPosts: userPosts })
}

exports.getBlog = async (req, res, next) => {
    const db = await database.getDb();
    const users = db.collection('users');
    const posts = db.collection('posts');

    const sortedPosts = await posts.find().sort({ createdAt: -1 }).toArray();

    if (sortedPosts) {
        for (p of sortedPosts) {
            const user = await users.findOne({ _id: new ObjectId(p.author) });
            p.userName = user.userName;
            for (comment of p.comments) {
                const user = await users.findOne({ _id: new ObjectId(comment.user) });
                comment.author = user.userName;
            }
        }
    } else {
        sortedPosts = [];
    }
    const user = await users.findOne({ userName: LoggedUser.getLoggedUser() });
    let firstName;
    let userId;
    if (user) {
        firstName = user.firstName;
        userId = user._id;
    } else {
        firstName = "blogger"
    }
    res.render('user/blog', { title: "Blog", firstName: firstName, sortedPosts: sortedPosts, user: user, errors: [] })
}


exports.logout = async (req, res) => {
    const db = await database.getDb();
    const users = db.collection('users');
    await users.updateOne({ userName: LoggedUser.getLoggedUser() }, { $set: { isActive: false } })
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/');
    });
};

exports.createPost = async (req, res) => {
    const db = await database.getDb();
    const userName = LoggedUser.getLoggedUser();
    const users = db.collection('users');
    const posts = db.collection('posts');

    const user = await users.findOne({ userName: userName });
    const sortedPosts = await posts.find().sort({ createdAt: -1 }).toArray();

    let firstName;
    if (user) {
        firstName = user.firstName;
    } else {
        firstName = "blogger"
    }

    if (sortedPosts) {
        for (p of sortedPosts) {
            const user = await users.findOne({ _id: new ObjectId(p.author) });
            p.userName = user.userName;
            for (comment of p.comments) {
                const user = await users.findOne({ _id: new ObjectId(comment.user) });
                comment.author = user.userName;
            }
        }
    } else {
        sortedPosts = [];
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.render('user/blog', {
            title: "Blog",
            firstName: firstName,
            sortedPosts: sortedPosts,
            user: user,
            errors: errors.array().map(error => error.msg)
        })
    }
    else {
        const userId = user._id;
        const tags = req.body.tags;

        newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            tags: tags.split(","),
            author: userId,
        })
        const posts = db.collection('posts');
        const result = await posts.insertOne(newPost);
        if (result) {
            res.render('user/blog', {
                title: "Blog",
                firstName: firstName,
                sortedPosts: sortedPosts,
                user: user,
                errors: []
            })
        }
        else {
            res.render('user/blog', {
                title: "Blog",
                firstName: firstName,
                sortedPosts: sortedPosts,
                user: user,
                errors: ["blog not created, please try again later..."]
            })
        }
    }
}

exports.addComment = async (req, res, next) => {
    const userName = LoggedUser.getLoggedUser();
    const db = await database.getDb();
    const users = db.collection('users');
    const posts = db.collection('posts');

    //user is person who will comment
    const user = await users.findOne({ userName: userName });
    const userId = user._id;
    const result = await posts.findOneAndUpdate(
        { _id: new ObjectId(req.params.postId) },
        {
            $push: {
                comments: {
                    _id: new ObjectId(),
                    user: new ObjectId(userId),
                    comment: req.body.comment,
                }
            }
        },
        { returnDocument: 'after' }
    );
    if (result) {
        console.log("comment added")
    }
    else {
        console.log("comment add failed")
    }
    res.redirect(`/user/${req.params.sourcePage}`);
}
