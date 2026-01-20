const { User } = require('../models');  //
exports.signup = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email exists' });
    
    const user = User.build(req.body);
    user.checkPasswordLength();
    await user.save();
    res.json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.upsertUser = async (req, res) => {
  try {
    await User.upsert(req.body, { validate: false });
    res.json({ message: 'User upserted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.findByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['role'] } // Hide role
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
