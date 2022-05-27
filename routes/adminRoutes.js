const express = require('express');
const router = express.Router();
const { addAdmin, adminLogin } = require('../controllers/adminController');

router.post('/add', addAdmin);
router.post('/login', adminLogin);

module.exports = router;
