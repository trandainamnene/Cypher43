const express = require('express');
const router = express.Router();
const freeToolController = require('../controllers/freeToolController');

router.get('/', freeToolController.getAllFreeTools);
router.get('/:id', freeToolController.getFreeToolById);
router.post('/', freeToolController.createFreeTool);
router.put('/:id', freeToolController.updateFreeTool);
router.delete('/:id', freeToolController.deleteFreeTool);

module.exports = router;

