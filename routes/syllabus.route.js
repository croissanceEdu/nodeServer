const router = require('express').Router();
// const { Mongoose } = require('mongoose');
const { getSyllabusController, completeSyllabusController,
    addSyllabusController, uncheckSyllabusController,
    addSyllabusMapController, deleteSyllabusMapController, getSyllabusMapController,
    getSyllabusMapByIdController, putSyllabusMapByIdController, deleteSyllabusController } = require('../controller/syllabus.controller');



router.post('/list', getSyllabusController);
router.post('/complete', completeSyllabusController);
router.post('/uncheck', uncheckSyllabusController);
router.post('/add', addSyllabusController);
router.post('/map/add', addSyllabusMapController);
router.delete('/map/:id', deleteSyllabusMapController);
router.get('/map', getSyllabusMapController);
router.get('/map/:id', getSyllabusMapByIdController);
router.put('/map/:id', putSyllabusMapByIdController);
router.delete('/list/:id', deleteSyllabusController);



module.exports = router