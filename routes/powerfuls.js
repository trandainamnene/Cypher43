const express = require('express');
const router = express.Router();
const powerfulController = require('../controllers/powerfulController');

router.get('/', powerfulController.getAllPowerfuls);
router.get('/:id', powerfulController.getPowerfulById);
router.post('/', powerfulController.createPowerful);
router.put('/:id', powerfulController.updatePowerful);
router.delete('/:id', powerfulController.deletePowerful);

module.exports = router;

