import {writeFile} from 'fs/promises';

import {getFilePaths} from './getFilePaths';

export async function saveTranscription(paths: any, transcription: any) {
  try {
    await writeFile(paths?.transcriptionFilePath, transcription);
  } catch (error) {
    console.error('Error saving transcription:', error);
    throw error;
  }
}

export async function updateTranscription(sessionId: string, transcription: string) {
  try {
    const {transcriptionFilePath} = await getFilePaths(sessionId);
    await writeFile(transcriptionFilePath, transcription);
  } catch (error) {
    console.error('Error saving transcription:', error);
    throw error;
  }
}
