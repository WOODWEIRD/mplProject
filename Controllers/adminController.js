const database = require("../Middleware/mongoDB");
const LoggedUser = require('./accountController');
ObjectId = require('mongodb').ObjectId;

exports.getAllUsers = async (req, res) => {
    const db = await database.getDb();
    const users = db.collection('users');

    const userName = LoggedUser.getLoggedUser();
    const user = await users.findOne({ userName: userName });
    const allUsers = await users.find().sort({ createdAt: -1 }).toArray();


    res.render('admin/allUsers', { title: "Admin All Users", user: user, allUsers: allUsers })
}

// in a post we need to delete users post first to reduce looping over comments
//then loop over remaining posts to delete users comments
exports.deleteUser = async (req, res, next) => {
    const db = await database.getDb();
    const users = db.collection('users');
    const posts = db.collection('posts');

    const user = await users.findOne({ _id: new ObjectId(req.params.userId) });
    const allPostsOfUser = await posts.find({ author: new ObjectId(req.params.userId) }).toArray();

    //delete user posts
    for (p of allPostsOfUser) {
        await posts.deleteOne({ _id: new ObjectId(p._id) })
    }

    //delete user comments
    const allPosts = await posts.find().toArray();
    for (p of allPosts) {
        //p.comments give array
        const postComments = p.comments;
        const newComments = postComments.filter((comment) => {
            return comment.user.toString() != req.params.userId
        })
        const updateComments = await posts.updateOne({ _id: new ObjectId(p._id) }, { $set: { comments: newComments } })
    }

    //delete likes of user on all posts
    for (like of user.likedPosts) {
        await posts.updateOne({ _id: new ObjectId(like) }, { $inc: { likes: -1 } });
    }

    //delete user
    await users.deleteOne({ _id: new ObjectId(req.params.userId) });

    res.redirect("/admin/allUsers")
}