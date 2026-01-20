const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');

router.post('/', postController.createPost);
router.delete('/:postId', postController.deletePost);
router.get('/details', postController.getPostsDetails);
router.get('/comment-count', postController.getPostsCommentCount);

module.exports = router;
