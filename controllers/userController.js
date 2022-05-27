const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const verifier = require('email-verify');
const randomstring = require('randomstring');
const path = require('path');
var jwt = require('jsonwebtoken');
// @desc    Get all users
// @route   GET /api/users/
// @access  Public
const getAllUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(201).json({ users });
  });
};

const createUser=async(req,res,)=>{
  const email = req.query.email;
  const user = req.body;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await User.updateOne(filter, updateDoc, options);
  console.log(result)
  const token = jwt.sign({ email: email }, "anik", { expiresIn: '7d' })
  res.send({ result,token });
}
const isAdmin=async(req,res)=>{
  const email = req.params.email;
  const user = await User.findOne({email: email});
  console.log(user)

  const isAdmin = user.role === 'admin';

  res.send({admin: isAdmin})
}
// @desc    Get specific user
// @route   POST /api/users/get-user
// @access  Public
const getUser = (req, res) => {
  User.find({ _id: mongoose.Types.ObjectId(req.body.user_id) }).then((user) => {
    res.status(201).json(user);
  });
};

// @desc    Add a user image
// @route   POST /api/users/add-image
// @access  Public
const addUserImage = (req, res) => {
  const randomFileName = randomstring.generate(20);
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      $push: { images: `./images/users/${randomFileName}.jpg` },
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) {
        const file = req.files.file;
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'client',
          'public',
          'images',
          'users',
          `${randomFileName}.jpg`
        );
        file.mv(filePath);
        res.status(200).json(updatedUser);
      } else res.status(404).send(err);
    }
  );
};

// @desc    Delete a user's image
// @route   POST /api/users/delete-image
// @access  Public
const deleteUserImage = (req, res) => {
  const fileName = req.body.image_path.split('/')[3];
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'client',
    'public',
    'images',
    'users',
    `${fileName}`
  );
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      $pull: { images: `./images/users/${fileName}` },
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) {
        fs.unlink(filePath, (err) => {
          if (err) return console.log(err);
          else res.status(200).json(updatedUser);
        });
      } else res.status(404).send(err);
    }
  );
};

// @desc    Update a user's name
// @route   POST /api/users/update-name
// @access  Public
const updateUserName = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      name: req.body.name,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Update a user's date of birth
// @route   POST /api/users/update-dob
// @access  Public
const updateUserDOB = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      dob: req.body.dob,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Update a user's location
// @route   POST /api/users/update-location
// @access  Public
const updateUserLocation = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      location: req.body.location,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Update a user's description
// @route   POST /api/users/update-description
// @access  Public
const updateUserDescription = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      description: req.body.description,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Block a user
// @route   POST /api/users/block
// @access  Public
const blockUser = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      isBlocked: true,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Unblock a user
// @route   POST /api/users/unblock
// @access  Public
const unblockUser = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.body.user_id),
    },
    {
      isBlocked: false,
    },
    { new: true },
    (err, updatedUser) => {
      if (updatedUser) res.status(200).json(updatedUser);
      else res.status(404).send(err);
    }
  );
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = (req, res) => {
  const { name, email, password, image } = req.body;
  verifier.verify(email, function (err, info) {
    if (err) {
      console.log(err);
      res.status(400).json({
        emailInvalid: true,
      });
    } else {
      if (info.success === false)
        res.status(400).json({
          emailInvalid: true,
        });
      else {
        User.findOne({ email }).then((userExists) => {
          if (userExists) {
            //user already exists in this email
            res.status(400).json({
              existingUser: true,
            });
          } else {
            bcrypt.hash(password, 6).then((hashedPassword) => {
              User.create({
                name: name,
                email: email,
                password: hashedPassword,
                $push: { images: image },
              }).then((user) => {
                res.status(201).json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  images: user.images,
                  isBlocked: user.isBlocked,
                });
              });
            });
          }
        });
      }
    }
  });
};

// @desc    Authenticate user and login
// @route   POST /api/users/login
// @access  Public
const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            images: user.images,
            isBlocked: user.isBlocked,
          });
        } else {
          res.status(400).json({
            //email found, but incorrect password
            isEmailMatch: true,
            isPasswordMatch: false,
          });
        }
      });
    } else {
      //email not found
      res.status(400).json({
        isEmailMatch: false,
      });
    }
  });
};

// @desc    Login/signup via facebook
// @route   POST /api/users/fb-auth
// @access  Public
const FBauth = (req, res) => {
  const { name, email, image } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      //updating info because info from facebook is changed
      User.findOneAndUpdate(
        { email },
        { $set: { 'images.0': image } },
        { new: true },
        (err, updatedUser) => {
          res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            images: updatedUser.images,
            isBlocked: updatedUser.isBlocked,
          });
        }
      );
    } else {
      User.create({
        name: name,
        email: email,
        $push: { images: image },
      }).then((user) => {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          images: user.images,
          isBlocked: user.isBlocked,
        });
      });
    }
  });
};

module.exports = {
  loginUser,
  registerUser,
  FBauth,
  getAllUsers,
  getUser,
  blockUser,
  unblockUser,
  addUserImage,
  updateUserName,
  updateUserDOB,
  updateUserLocation,
  updateUserDescription,
  deleteUserImage,
  createUser,
  isAdmin
};
