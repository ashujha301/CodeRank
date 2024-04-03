const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');

router.get('/:codeId/code', userControllers.getSpecificCodeByUser); // 
router.get('/codes', userControllers.getAllCodesByUser); // this route is working fine
router.post('/run', userControllers.runUserCode);
router.post('/submit', userControllers.submitUserCode); //saving in database


module.exports = router;