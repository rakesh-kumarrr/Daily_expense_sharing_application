const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserController = require('../controllers/userController');

router.post('/create', UserController.createUser);
router.get('/:email', authMiddleware, UserController.getUser);
router.post('/login', UserController.login);

module.exports = router;
