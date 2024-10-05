require('dotenv').config();
const translate = require('@iamtraction/google-translate');

const libreTranslate = async (text, targetLanguage) => {
  const libreTranslateUrl =
    process.env.LIBRETRANSLATE_URL || 'http://127.0.0.1:5000';

  try {
    const response = await fetch(`${libreTranslateUrl}/translate`, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const jsonResponse = await response.json();

    return jsonResponse.translatedText;
  } catch (error) {
    console.error(error);
  }
};

const googleTranslate = async (text, targetLanguage) => {
  try {
    const translatedText = await translate(text, { to: targetLanguage });

    return translatedText.text;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  libreTranslate,
  googleTranslate,
};
