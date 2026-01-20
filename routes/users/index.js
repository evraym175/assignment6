const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.post('/signup', userController.signup);
router.put('/:id', userController.upsertUser);
router.get('/by-email', userController.findByEmail);
router.get('/:id', userController.findById);

module.exports = router;
