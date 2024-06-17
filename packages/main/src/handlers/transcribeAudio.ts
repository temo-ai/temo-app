import {OpenAIWhisperAudio} from 'langchain/document_loaders/fs/openai_whisper_audio';

import {readConfigFile} from '../utils/constants';

export const transcribeAudio = async (filePath: string) => {
  try {
    const config = await readConfigFile();
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API key not set');
    }
    const loader = new OpenAIWhisperAudio(filePath, {
      clientOptions: {apiKey: config.openaiApiKey},
    });
    const docs = await loader.load();
    return docs?.[0]?.pageContent || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
  }
};
