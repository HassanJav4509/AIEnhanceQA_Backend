const axios = require('axios');
require('dotenv').config();

/**
 * Update metadata for a specific chunk using Python Flask API.
 */
const processChunkWithPython = async (namespace, documentId, chunkText) => {
  try {
    // Prepare JSON payload
    const payload = {
      namespace,
      document_id: documentId,
      chunk_text: chunkText,
    };

    console.log('Sending chunk to Python API:', payload);

    // Make a POST request to the Python Flask API
    const response = await axios.post(`${process.env.PYTHON_API_BASE_URL}/update-chunk`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from Python API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error interacting with Python API:', error.response?.data || error.message);
    throw new Error('Failed to process the chunk with the Python API');
  }
};

module.exports = { processChunkWithPython };
