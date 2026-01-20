const { Post, User, Comment, sequelize } = require('../models');

exports.createPost = async (req, res) => {
  try {
    const post = Post.build(req.body);
    await post.save();
    res.json({ message: 'Post created', post });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    if (post.userId != req.body.userId) {
      return res.status(403).json({ error: 'Only owner can delete' });
    }
    
    await post.destroy(); 
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'], 
      include: [
        { 
          model: User, 
          attributes: ['id', 'name'] 
        },
        { 
          model: Comment, 
          attributes: ['id', 'content'] 
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
