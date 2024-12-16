const axios = require('axios');
const { queryVectors } = require('./pineconeService');

/**
 * Generate embeddings using OpenAI's API.
 */
const generateEmbedding = async (text) => {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      model: 'text-embedding-ada-002',
      input: text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data[0].embedding;
};

/**
 * Build a chat-style response by querying Pinecone and formatting results.
 */
const askQuestion = async (indexName, question, topK = 5) => {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(question);

  // Query Pinecone
  const matches = await queryVectors(indexName, queryEmbedding, topK);

  // Format the response
  const context = matches.map(
    (match) => `Document: ${match.metadata.title}\nContent: ${match.metadata.contentSnippet}`
  );

  // Generate response with OpenAI Chat Completion API
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Answer based on the following context:\n\n${context.join('\n\n')}\n\nQuestion: ${question}` },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
};

module.exports = { askQuestion };
