const express = require('express');
const { ingestDocument, getDocuments } = require('../controllers/documentController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();
router.post('/ingest', upload.single('file'), ingestDocument);
router.get('/docs', getDocuments);

module.exports = router;