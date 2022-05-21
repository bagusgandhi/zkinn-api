const express = require('express');
const diseaseController = require('../Controllers/diseaseController');
const authController = require('../Controllers/authController');

const router = express.Router();

router
  .route('/:id/diseases')
  .post(authController.protect, diseaseController.createDisease);

router
  .route('/:id/diseases/:disease_id')
  .get(authController.protect, diseaseController.getDisease)
  .delete(authController.protect, diseaseController.deleteDisease);

module.exports = router;
