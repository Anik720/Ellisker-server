const express = require('express');
const router = express.Router();
const {
	getAllHangouts,
	addHangout,
	joinHangout,
	exitHangout,
	addHangoutMessage,
	getAllHangoutMessages,
	myHangout
} = require('../controllers/hangoutController.js');

router.get('/', getAllHangouts);
router.get('/myitem',myHangout );
router.post('/add', addHangout);
router.post('/join', joinHangout);
router.post('/exit', exitHangout);
router.post('/add-message', addHangoutMessage);
router.post('/get-messages', getAllHangoutMessages);

module.exports = router;
