const express = require('express');
const router = express.Router();

const calenderController=require('../controllers/calenderConroller')

router.post('/',calenderController.careteCalender);
router.get('/',calenderController.getAlldate);
router.delete('/:id',calenderController.deleteDate);
router.put('/:id',calenderController.updateDate);

module.exports = router;