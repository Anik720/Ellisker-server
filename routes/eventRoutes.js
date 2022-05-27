const express = require('express');
const router = express.Router();
const {
	addEvent,
	getAllEvents,
	joinEvent,
	exitEvent,
	addEventMessage,
	getAllEventMessages,
} = require('../controllers/eventController.js');
const verifyJWT=require('../controllers/authController')

router.get('/', getAllEvents);
router.post('/add',verifyJWT, addEvent);
router.post('/join', joinEvent);
router.post('/exit', exitEvent);
router.post('/add-message', addEventMessage);
router.post('/get-messages', getAllEventMessages);

module.exports = router;
