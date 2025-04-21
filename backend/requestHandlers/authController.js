const User = require('../schema/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
  
      const user = await User.create({ name, email, password, projectCount: 0 }); //set projectCount to 0 for inc
      const token = createToken(user);
      res.status(201).json({ token, user: { id: user._id, name, email, projectCount: user.projectCount } });
    } catch (err) {
      res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  };

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};