require('dotenv').config();
const { Ollama } = require('@langchain/ollama');
const {
  SystemMessagePromptTemplate,
  ChatPromptTemplate,
} = require('@langchain/core/prompts');

const ollama = async (text) => {
  const llm = new Ollama({
    model: process.env.OLLAMA_MODEL || 'llama3',
    temperature: 0.2,
  });

  const message = SystemMessagePromptTemplate.fromTemplate('{text}');
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      'ai',
      'You are a helpful assistant. You reply with brief, to-the-point answers with no elaboration.',
    ],
    message,
  ]);

  const chain = chatPrompt.pipe(llm);

  try {
    return await chain.invoke({ text });
  } catch (error) {
    console.error(error);
  }
};

module.exports = ollama;
