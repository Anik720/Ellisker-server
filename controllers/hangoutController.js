const mongoose = require('mongoose');
const Hangout = require('../models/hangoutModel');

// @desc    Add new hangout
// @route   POST /api/hangouts/add
// @access  Public
const addHangout = (req, res) => {
	Hangout.create(
		{
			createdBy: mongoose.Types.ObjectId(req.body.createdBy),
			title: req.body.title,
			description: req.body.description,
			date: req.body.date,
			location: req.body.location,
			uid:req.body.uid
		},
		(err, hangout) => {
			if (hangout) {
				res.status(200).json(hangout);
			} else {
				res.status(404).send(err);
			}
		}
	);
};

// @desc    Get all hangouts
// @route   POST /api/hangouts/
// @access  Public
const getAllHangouts = async(req, res) => {
	const uid=await req.query?.uid
	console.log(uid)
	Hangout.find({})
		.populate('createdBy')
		.populate('messages.sender')
		.populate('members')
		.exec((err, hangouts) => {
			if (hangouts) {
				res.status(200).json(hangouts);
			} else {
				res.status(404).send(err);
			}
		});


// const uid=req.query.uid
// 	try {
//     const calender = await Hangout.find({uid});

//     res.status(200).json({
//       message: 'Success',
//       data: {
//         calender,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       message: 'failed',
//     });
//   }
};
const myHangout= async (req, res, next) => {
	const uid=req.query.uid
	console.log(uid)
		try {
	    const calender = await Hangout.find({uid});
	
	    res.status(200).json({
	      message: 'Success',
	      data: {
	        calender,
	      },
	    });
	  } catch (err) {
	    res.status(404).json({
	      message: 'failed',
	    });
	  }
};

// @desc    User joins a hangout
// @route   POST /api/hangouts/join
// @access  Public
const joinHangout = (req, res) => {
	Hangout.findOneAndUpdate(
		{
			_id: mongoose.Types.ObjectId(req.body.hangout_id),
		},
		{
			$push: { members: mongoose.Types.ObjectId(req.body.user_id) },
		},
		{ new: true },
		(err, updatedHangout) => {
			if (updatedHangout) res.status(200).json(updatedHangout);
			else res.status(404).send(err);
		}
	);
};

// @desc    User exits a hangout
// @route   POST /api/hangouts/exit
// @access  Public
const exitHangout = (req, res) => {
	Hangout.findOneAndUpdate(
		{
			_id: mongoose.Types.ObjectId(req.body.hangout_id),
		},
		{
			$pull: { members: mongoose.Types.ObjectId(req.body.user_id) },
		},
		{ new: true },
		(err, updatedHangout) => {
			if (updatedHangout) res.status(200).json(updatedHangout);
			else res.status(404).send(err);
		}
	);
};

// @desc    Add message to message thread
// @route   POST /api/hangouts/add-message
// @access  Public
const addHangoutMessage = (req, res) => {
	const message = {
		sender: mongoose.Types.ObjectId(req.body.user_id),
		content: req.body.message,
	};
	Hangout.findOneAndUpdate(
		{
			_id: mongoose.Types.ObjectId(req.body.hangout_id),
		},
		{
			$push: { messages: message },
		},
		{ new: true },
		(err, updatedThread) => {
			if (updatedThread) res.status(200).json(updatedThread);
			else res.status(404).send(err);
		}
	);
};

// @desc    Get all messages from message thread
// @route   POST /api/hangouts/get-messages
// @access  Public
const getAllHangoutMessages = (req, res) => {
	Hangout.find({ _id: mongoose.Types.ObjectId(req.body.hangout_id) })
		.populate('messages.sender')
		.exec((err, hangoutMessages) => {
			if (err) res.status(404).send(err);
			else res.status(200).json(hangoutMessages[0].messages);
		});
};

module.exports = {
	addHangout,
	getAllHangouts,
	joinHangout,
	exitHangout,
	addHangoutMessage,
	getAllHangoutMessages,
	myHangout
};
