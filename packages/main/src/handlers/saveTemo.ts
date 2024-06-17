import fs from 'fs';
import {transcribeAudio} from './transcribeAudio';
import {ensureDirectoryExists, saveWebMFile} from './events';
import {getFilePaths} from './getFilePaths';
import {convertWebMToMP3} from './convertWebMToMP3';
import {saveTranscription} from './saveTranscription';
import {generateArticle} from './generateArticle';

import type {WebContentsView} from 'electron';

export async function save(sessionId: string, audioBuffer: Buffer, temoView: WebContentsView) {
  try {
    const paths = getFilePaths(sessionId);
    await ensureDirectoryExists(paths?.audioDir);
    await saveWebMFile(paths?.webmFilePath, audioBuffer);
    await convertWebMToMP3(paths?.webmFilePath, paths?.mp3FilePath);
    const transcription = await transcribeAudio(paths?.mp3FilePath);
    console.log('Transcription:', transcription);
    if (transcription) {
      await saveTranscription(paths, transcription);
    }
    await generateArticle({sessionId, customPrompt: transcription || ''});
    temoView.webContents.send('temos-changed');
    fs.unlinkSync(paths?.webmFilePath);
  } catch (error) {
    console.error('Error saving audio and transcription:', error);
    throw error;
  }
}

export async function saveTemo(sessionId: string, temoView: WebContentsView) {
  try {
    await generateArticle({sessionId, customPrompt: ''});
    temoView.webContents.send('temos-changed');
  } catch (error) {
    console.error('Error saving audio and transcription:', error);
    throw error;
  }
}
