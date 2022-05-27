const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');

// @desc    Add a new admin
// @route   POST /api/admins/add
// @access  Public
const addAdmin = (req, res) => {
	const { name, username, password } = req.body;
	Admin.findOne({ username }).then((userExists) => {
		if (userExists) {
			//user already exists with this username
			res.status(404).json({
				existingUser: true,
			});
		} else {
			bcrypt.hash(password, 6).then((hashedPassword) => {
				Admin.create({
					name: name,
					username: username,
					password: hashedPassword,
				}).then((admin) => {
					res.status(201).json({
						_id: admin._id,
						name: admin.name,
						username: admin.username,
					});
				});
			});
		}
	});
};

// @desc    Login admin
// @route   POST /api/admins/login
// @access  Public
const adminLogin = (req, res) => {
	const { username, password } = req.body;
	Admin.findOne({ username }).then((admin) => {
		if (admin) {
			bcrypt.compare(password, admin.password).then((isMatch) => {
				if (isMatch) {
					res.status(200).json({
						_id: admin._id,
						name: admin.name,
						username: admin.username,
					});
				} else {
					res.status(400).json({
						//username found, but incorrect password
						isUsernameMatch: true,
						isPasswordMatch: false,
					});
				}
			});
		} else {
			//username not found
			res.status(400).json({
				isUsernameMatch: false,
			});
		}
	});
};

module.exports = {
	addAdmin,
	adminLogin,
};
