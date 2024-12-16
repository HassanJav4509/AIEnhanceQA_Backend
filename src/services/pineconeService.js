// src/services/pineconeService.js
const { Pinecone } = require('@pinecone-database/pinecone');

class PineconeService {
  constructor() {
    this.client = new Pinecone(
      {
        apiKey: process.env.PINECONE_API_KEY,
        // environment: process.env.PINECONE_ENVIRONMENT,
      });

    this.index = this.client.Index(process.env.PINECONE_INDEX);
  }

  async upsertVector(namespace, vectors) {
    await this.index.namespace(namespace).upsert(vectors);
  }
  
  async queryVector(namespace, queryVector, topK = 5) {
    const response = await this.index.namespace(namespace).query({
      topK,
      vector: queryVector,
      includeMetadata: true,
    });
    return response.matches;
  }

  async getDocs() {
    
    const response = await this.index.describeIndexStats();
    
    return response;
  }
}

module.exports = PineconeService;
