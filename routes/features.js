const express = require('express');
const router = express.Router();
const featuresController = require('../controllers/featuresController');

router.get('/', featuresController.getAllFeatures);
router.get('/:id', featuresController.getFeatureById);
router.post('/', featuresController.createFeature);
router.put('/:id', featuresController.updateFeature);
router.delete('/:id', featuresController.deleteFeature);

module.exports = router;

