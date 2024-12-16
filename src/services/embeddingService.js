const axios = require('axios');
let { OpenAIEmbeddings } = require("@langchain/openai");

const generateEmbeddings = async (chunks) => {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    var docData = []
    for (const [index, chunk] of chunks.entries()) {
        docData.push(chunk);
    }

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 100,
        model: 'text-embedding-ada-002',
    });

    const scheduleEmbeddings = await embeddings.embedDocuments(docData);

    return scheduleEmbeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error.message,);
    throw error;
  }
};

const generateEmbeddingQuery = async (query) => {
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(query);

    return queryEmbedding;
};

module.exports = { generateEmbeddings, generateEmbeddingQuery };
