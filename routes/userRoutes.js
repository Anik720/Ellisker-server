const express = require('express');
const router = express.Router();
const {
  loginUser,
  createUser,
  registerUser,
  FBauth,
  getAllUsers,
  blockUser,
  unblockUser,
  getUser,
  addUserImage,
  updateUserName,
  updateUserDOB,
  updateUserLocation,
  updateUserDescription,
  deleteUserImage,
  isAdmin
  
} = require('../controllers/userController.js');


router.get('/', getAllUsers);
router.get('/admin/:email', isAdmin);
router.put('/user', createUser);
router.post('/get-user', getUser);
router.post('/add-image', addUserImage);
router.post('/delete-image', deleteUserImage);
router.post('/update-name', updateUserName);
router.post('/update-dob', updateUserDOB);
router.post('/update-location', updateUserLocation);
router.post('/update-description', updateUserDescription);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/fb-auth', FBauth);

module.exports = router;
