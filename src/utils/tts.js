require('dotenv').config();
const fs = require('fs');
const { pipeline } = require('stream/promises');
const { Readable } = require('stream');

const voicevox = async (
  text,
  speaker,
  options = {
    speedScale: 1,
    pitchScale: 0,
    intonationScale: 1,
    volumeScale: 1,
    prePhonemeLength: 0.1,
    postPhonemeLength: 0.1,
    pauseLength: null,
    pauseLengthScale: 1,
    outputSamplingRate: 24000,
    outputStereo: false,
  },
  outputName = 'voice'
) => {
  const voicevoxUrl = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';

  try {
    const audioQueryResponse = await fetch(
      `${voicevoxUrl}/audio_query?${new URLSearchParams({
        text,
        speaker,
      }).toString()}`,
      {
        method: 'POST',
      }
    );

    const audioQueryJSONResponse = await audioQueryResponse.json();

    const speechSynthesisResponse = await fetch(
      `${voicevoxUrl}/synthesis?${new URLSearchParams({
        speaker,
      }).toString()}`,
      {
        method: 'POST',
        body: JSON.stringify({
          ...audioQueryJSONResponse,
          ...options,
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const speechSynthesisArrayBufferResponse =
      await speechSynthesisResponse.arrayBuffer();

    await fs.promises.mkdir('./output', { recursive: true });

    // Using pipeline for async/await in streams.
    // Reference: https://stackoverflow.com/a/65938887
    await pipeline(
      Readable.from(Buffer.from(speechSynthesisArrayBufferResponse)),
      fs.createWriteStream(`./output/${outputName}.wav`)
    );
  } catch (error) {
    console.error(error);
  }
};

const piper = async (
  text,
  voice,
  outputName = 'piper'
) => {
  const piperUrl = 'http://127.0.0.1:8080';
  const voiceName = `${voice}.onnx`;

  try {
    const ttsResponse = await fetch(`${piperUrl}/api/tts`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice: voiceName,
      }),
    });

    const ttsArrayBufferResponse = await ttsResponse.arrayBuffer();

    await fs.promises.mkdir('./output', { recursive: true });

    await pipeline(
      Readable.from(Buffer.from(ttsArrayBufferResponse)),
      fs.createWriteStream(`./output/${outputName}.wav`)
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  voicevox,
  piper,
};
