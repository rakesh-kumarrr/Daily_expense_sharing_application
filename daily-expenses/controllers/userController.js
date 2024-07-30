const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { email, name, mobile, password } = req.body;
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ email, name, mobile, password: hashedPassword });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    


// Generate JWT Token
const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
