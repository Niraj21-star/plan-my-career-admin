const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  status,
  listCollections,
  listDocuments,
  getDocument,
} = require('../controllers/externalDbController');

router.use(verifyToken, checkRole('admin'));

router.get('/status', status);
router.get('/collections', listCollections);
router.get('/collections/:collectionName', listDocuments);
router.get('/collections/:collectionName/:id', getDocument);

module.exports = router;
