require('dotenv').config();
const ollama = require('./utils/llm');
const { libreTranslate, googleTranslate } = require('./utils/translate');
const { voicevox, piper } = require('./utils/tts');
const dayjs = require('dayjs');
const player = require('play-sound')((opts = {}));
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const run = async (text) => {
  const outputName = `voice-${dayjs().format('YYYY-MM-DD_hh-mm-ss')}`;

  // llm
  const llmResponse = await ollama(text);

  let ttsProvider;

  switch (process.env.TTS_PROVIDER) {
    case 'voicevox':
      ttsProvider = 'voicevox';
      break;
    case 'piper':
      ttsProvider = 'piper';
      break;
    default:
      ttsProvider = 'voicevox';
  }

  let translatedLLMResponse;

  switch (process.env.TRANSLATOR_PROVIDER) {
    case 'libretranslate':
      if (ttsProvider === 'voicevox') {
        translatedLLMResponse = await libreTranslate(llmResponse, 'ja');
      } else {
        translatedLLMResponse = await libreTranslate(llmResponse, 'en');
      }
      break;
    case 'googletranslate':
      if (ttsProvider === 'voicevox') {
        translatedLLMResponse = await googleTranslate(llmResponse, 'ja');
      } else {
        translatedLLMResponse = await googleTranslate(llmResponse, 'en');
      }
      break;
    default:
      if (ttsProvider === 'voicevox') {
        translatedLLMResponse = await libreTranslate(llmResponse, 'ja');
      } else {
        translatedLLMResponse = await libreTranslate(llmResponse, 'en');
      }
  }

  if (ttsProvider === 'voicevox') {
    await voicevox(
      translatedLLMResponse,
      process.env.VOICEVOX_SPEAKER_ID,
      undefined,
      outputName
    );
  } else {
    await piper(translatedLLMResponse, process.env.PIPER_VOICE_NAME, outputName);
  }

  // print llm output
  console.log(`AI: ${llmResponse}`);
  // play sound
  player.play(`./output/${outputName}.wav`);
};

const humanAskQuestion = async () => {
  rl.question('Human: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    await run(input);

    humanAskQuestion();
  });
};

console.log('Type "exit" to quit.');
humanAskQuestion();
