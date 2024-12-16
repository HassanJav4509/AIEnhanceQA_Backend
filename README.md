# AI-Enhanced Document QA System - Backend

## Overview

This backend application is part of an AI-Enhanced Document QA System that processes documents, extracts meaningful topics, and enables users to query documents for relevant information. The system integrates with OpenAI for embeddings and Pinecone for vector database operations.

## Features

1. **Document Processing**: Processes documents, chunks text, and stores metadata.
2. **Embedding Generation**: Uses OpenAI’s embeddings for vectorizing document content.
3. **Topic Extraction**: Extracts topics from document chunks for metadata enrichment.
4. **Pinecone Integration**: Manages document vectors and metadata in a Pinecone vector database.
5. **Question Answering**: Queries stored document chunks to provide relevant answers based on vector similarity.

## Prerequisites

1. **Node.js**: Ensure Node.js v14 or higher is installed.
2. **Dependencies**: Install the required npm packages using `package.json`.
3. **Environment Variables**: Set up the `.env` file for API keys and configurations.

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository_url>
cd Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PYTHON_API_BASE_URL=http://127.0.0.1:5000
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
PINECONE_REGION=your_pinecone_region
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Start the Server

```bash
npm start
```

The application will run on `http://127.0.0.1:3000` by default.

## API Endpoints

### 1. `POST /ingest-document`

**Description**: Processes and stores document chunks in Pinecone with metadata.

**Request Parameters:**

- `file`: The document file to upload (PDF supported).

**Response:**

- `200 OK` with details about processed chunks and namespace.
- `400 Bad Request` if the file is missing or invalid.

**Example cURL Command:**

```bash
curl -X POST http://127.0.0.1:3000/ingest-document \
  -F "file=@sample.pdf"
```

### 2. `POST /answer-question`

**Description**: Queries stored document chunks and returns relevant answers.

**Request Parameters:**

- `question`: The query to answer.
- `namespace`: The namespace of the document to query.

**Response:**

- `200 OK` with concatenated relevant content and scores.
- `400 Bad Request` if parameters are missing.

**Example cURL Command:**

```bash
curl -X POST http://127.0.0.1:3000/answer-question \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the topic?", "namespace": "docs_sample"}'
```

### 3. `POST /process-chunk`

**Description**: Updates chunk metadata in Pinecone.

**Request Parameters:**

- `namespace`: The namespace of the document.
- `document_id`: The ID of the document chunk.
- `chunk_text`: The text content of the chunk.

**Response:**

- `200 OK` if the metadata is updated successfully.
- `400 Bad Request` if parameters are missing.

**Example cURL Command:**

```bash
curl -X POST http://127.0.0.1:3000/process-chunk \
  -H "Content-Type: application/json" \
  -d '{"namespace": "docs_sample", "document_id": "sample-0", "chunk_text": "This is a chunk."}'
```

## Challenges Faced

1. **Metadata Updates**: Ensuring updates only modify relevant fields without overwriting existing metadata.
2. **Error Handling**: Handling missing files, invalid parameters, or external API errors gracefully.
3. **Integration Testing**: Verifying communication between the backend and Python Flask API.

## Assumptions

1. Pinecone and OpenAI API keys are valid and correctly configured in the `.env` file.
2. Python Flask API is running and accessible via the configured base URL.
3. Uploaded documents are in a supported format (e.g., PDF or text).

## Acknowledgments

- **OpenAI**: For embedding generation.
- **Pinecone**: For vector storage and search capabilities.
- **LangChain**: For advanced LLM integrations.

## License

This project is licensed under the MIT License.

