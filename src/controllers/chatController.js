// src/controllers/chatController.js
const { generateEmbeddingQuery } = require('../services/embeddingService');
const PineconeService = require('../services/pineconeService');
let { loadQAStuffChain } = require("langchain/chains");
const LangchainOpenAI = require("@langchain/openai").OpenAI;

const answerQuestion = async (req, res) => {
  try {
    const { question, namespace } = req.body;
    if (!question || !namespace) {
      throw new Error('Question and namespace are required');
    } 

    const queryVector = await generateEmbeddingQuery(question);
    const pineconeClient = new PineconeService();
    const results = await pineconeClient.queryVector(namespace, queryVector);

    const answers = results.map((match) => ({
      text: match.metadata.chunk,
      score: match.score,
    }));
    console.log(answers)

    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
    const averageScore = answers.length > 0 ? totalScore / answers.length : 0;

    const concatenatedText = results
        .map((match) => match.metadata.text)
        .join(" ");

    // console.log(`Concatenated Text: ${concatenatedText}`);

    // const llm = new LangchainOpenAI({
    //     openAIApiKey: process.env.OPENAI_API_KEY,
    // });
    // const chain = loadQAStuffChain(llm);

    // const result = await chain.call({
    //     input_documents: [new Document({ pageContent: concatenatedText })],
    //     question: query,
    // });


    res.status(200).json({ result: concatenatedText, data: answers, averageScore:averageScore});
  } catch (error) {
    console.log("error ", error)
    res.status(400).json({ error: error.message });
  }
};

module.exports = { answerQuestion };
