const express = require('express');
const router = express.Router();
const hungtingTierController = require('../controllers/hungtingTierController');

router.get('/', hungtingTierController.getAllHungtingTiers);
router.get('/:id', hungtingTierController.getHungtingTierById);
router.post('/', hungtingTierController.createHungtingTier);
router.put('/:id', hungtingTierController.updateHungtingTier);
router.delete('/:id', hungtingTierController.deleteHungtingTier);

module.exports = router;

