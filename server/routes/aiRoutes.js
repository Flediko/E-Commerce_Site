const express = require('express');
const router = express.Router();
const {
  processVoiceCommand,
  getRecommendations,
  voiceSearch
} = require('../controllers/aiController');

router.post('/voice-command', processVoiceCommand);
router.post('/recommendations', getRecommendations);
router.post('/search', voiceSearch);

module.exports = router;
