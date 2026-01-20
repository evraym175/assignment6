const { Post, User, Comment, sequelize } = require('../models');

exports.createPost = async (req, res) => {
  try {
    // Create new Post using new instance and save (0.5 grade)
    const post = Post.build(req.body);
    await post.save();
    res.json({ message: 'Post created', post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    // Delete post by id, only owner can delete (0.5 grade)
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check if user is owner
    if (post.userId != req.body.userId) {
      return res.status(403).json({ error: 'Only owner can delete' });
    }
    
    await post.destroy(); // Soft delete (paranoid: true)
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostsDetails = async (req, res) => {
  try {
    // Get all posts with user details and comments (show specific fields) (0.5 grade)
    const posts = await Post.findAll({
      attributes: ['id', 'title'], // Only id, title for post
      include: [
        { 
          model: User, 
          attributes: ['id', 'name'] // Only id, name for user
        },
        { 
          model: Comment, 
          attributes: ['id', 'content'] // Only id, content for comments
        }
      ]
    });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostsCommentCount = async (req, res) => {
  try {
    // Get posts with comment count (0.5 grade)
    const posts = await Post.findAll({
      attributes: [
        'id',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
      ],
      include: [{
        model: Comment,
        as: 'Comments',
        attributes: [],
        required: false
      }],
      group: ['Post.id'],
      raw: true
    });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
