// src/services/documentService.js
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const PineconeService = require('./pineconeService');
const { generateEmbeddings } = require('./embeddingService');
const { extractNamedEntities } = require('./nerService');

let OpenAI = require("openai");
let { OpenAIEmbeddings } = require("@langchain/openai");
let { loadQAStuffChain } = require("langchain/chains");
let { Document } = require("langchain/document");
const LangchainOpenAI = require("@langchain/openai").OpenAI;

const processFile = async (filePath, fileName) => {
  const ext = path.extname(filePath);
  let content = '';

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      content = pdfData.text;
    } else if (ext === '.txt') {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    // Chunk content into smaller parts (e.g., 500 characters each)
    const chunkSize = 500;
    const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'g'));

    const pineconeClient = new PineconeService();
    const namespace = `docs_${fileName}`;

    const embeddings = await generateEmbeddings(chunks);

    const scheduleVectors = embeddings.map((embedding, i) => ({
      id: `${fileName}-${i}`,
      values: embedding,
      metadata: {
          fileName: fileName,
          text: chunks[i],
      }
    }));

    await pineconeClient.upsertVector(namespace, scheduleVectors);

    return { chunks, namespace };
  } catch (error) {
    console.error('Error processing file:', error.message, error);
    throw error;
  } finally {
    // fs.unlinkSync(filePath); // Clean up the file
  }
};

const getDocs = async () => {
  const pineconeClient = new PineconeService();
  const results = pineconeClient.getDocs();

  return results; 
}

module.exports = { processFile, getDocs };
