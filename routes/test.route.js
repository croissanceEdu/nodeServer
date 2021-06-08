const router = require('express').Router();

const { addMapIdOnSyllabus, getStudentMap, addMapIdOnFeedback, getBackupFromDb, addActiveonUser } = require('../controller/test.coontroller');


router.get('/getmap', getStudentMap);
router.get('/mapidonsyllabus', addMapIdOnSyllabus);
router.get('/mapidonfeedback', addMapIdOnFeedback);
router.get('/activeonuser', addActiveonUser);
router.get('/getbackups', getBackupFromDb);

module.exports = router