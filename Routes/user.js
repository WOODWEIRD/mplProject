const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/blog', userController.getBlog);
router.get('/logout', userController.logout);
router.post('/createPost', userController.createPost);
router.post('/addComment/:postId/:sourcePage', userController.addComment);
router.get('/profile', userController.getProfile);
router.get('/editProfile', userController.getEditProfile);
router.post('/editProfile', userController.editProfile);
router.get('/deletePost/:postId/:sourcePage', userController.deletePost);
router.get('/deleteComment/:postId/:commentId/:sourcePage', userController.deleteComment);
router.get('/blogger/:bloggerUsername', userController.getBlogger);
router.get('/like/:postId/:sourcePage', userController.addLike);
router.get('/removeLike/:postId/:sourcePage', userController.removeLike);

module.exports = router;