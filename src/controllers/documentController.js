// src/controllers/documentController.js
const { processFile, getDocs } = require('../services/documentService');

const { processChunkWithPython } = require('../services/pythonService');

const ingestDocument = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const { path: filePath, originalname: fileName } = req.file;

    // Step 1: Process the file locally (e.g., chunking, namespace creation)
    console.log('Processing file locally...');
    const localResult = await processFile(filePath, fileName);

    const { chunks, namespace } = localResult;

    // Step 2: Update metadata for each chunk via Python API
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const documentId = `${fileName}-${i}`;
      processChunkWithPython(namespace, documentId, chunk);
    }

    res.status(200).json({
      message: 'Document processed successfully',
      localProcessing: {
        chunks,
        namespace,
      },
    });
  } catch (error) {
    console.error('Error in ingestDocument:', error.response?.data || error.message);
    res.status(400).json({ error: error.message });
  }
};


const getDocuments = async (req, res) => {
    try {
        const result = await getDocs();

        res.status(200).json({
        message: 'Document fetched successfully',
        data: result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { ingestDocument, getDocuments };
