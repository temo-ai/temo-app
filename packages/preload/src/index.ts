import {sha256sum} from './nodeCrypto';
import {versions} from './versions';
import {ipcRenderer} from 'electron';
export {sha256sum, versions};
import type {Config, ChatHistoryItem} from '../../renderer/src/utils/atoms';

export const startRecording = () => ipcRenderer.invoke('start-recording');
export const stopRecording = () => ipcRenderer.invoke('stop-recording');
export const closeRecorder = () => ipcRenderer.invoke('close-recorder');

export const onScreenSourceId = (callback: (sourceId: string) => void) => {
  ipcRenderer.on('screen-source-id', (_, sourceId) => {
    console.log('sourceId', sourceId);
    callback(sourceId);
  });
};
export const recordScreenVideo = () => ipcRenderer.invoke('record-screen-video');
export const saveScreenVideo = (videoBuffer?: ArrayBuffer) =>
  ipcRenderer.invoke('save-screen-video', videoBuffer);

export const deleteAllTemos = () => ipcRenderer.invoke('delete-all-temos');
export const fetchTemos = () => ipcRenderer.invoke('fetch-temos');
export const fetchTemo = (id: string) => ipcRenderer.invoke('fetch-temo', id);
export const deleteTemo = (id: number) => ipcRenderer.invoke('delete-temo', id);
export const updateTemo = (id: number, newName: string) =>
  ipcRenderer.invoke('update-temo', id, newName);
export const updateTemoChatHistory = (params: {
  sessionId: string;
  chatHistory: ChatHistoryItem[];
}) => ipcRenderer.invoke('update-temo-chat-history', params);
export const createFolder = (folderName: string) => ipcRenderer.invoke('create-folder', folderName);
export const fetchFolders = () => ipcRenderer.invoke('fetch-folders');
export const updateTemoFolder = (temoId: number, folderId: number) =>
  ipcRenderer.invoke('update-temo-folder', temoId, folderId);
export const removeFromFolder = (temoId: number) =>
  ipcRenderer.invoke('remove-from-folder', temoId);

export const fetchTemoFolder = (id: number) => ipcRenderer.invoke('fetch-temo-folder', id);
export const fetchFolder = (id: number) => ipcRenderer.invoke('fetch-folder', id);
export const deleteFolder = (id: number) => ipcRenderer.invoke('delete-folder', id);

export const onUpdateModalSize = () => ipcRenderer.invoke('update-modal-size');
export const onUpdateTitle = (callback: (title: string) => void) => {
  ipcRenderer.on('update-title', (_, title) => callback(title));
};

export const loadUrl = (url: string) => ipcRenderer.invoke('load-url', url);

export const getUserDataPath = () => ipcRenderer.invoke('get-user-data-path');

export const onUrlNavigated = (callback: (url: string) => void) => {
  ipcRenderer.on('url-navigated', (_, url) => callback(url));
};

export const closeTab = () => ipcRenderer.invoke('close-tab');

// Add these inside the contextBridge.exposeInMainWorld

export const goBack = () => ipcRenderer.invoke('go-back');
export const goForward = () => ipcRenderer.invoke('go-forward');
export const reloadPage = () => ipcRenderer.invoke('reload-page');

export const onTemoChanged = (callback: () => void) => {
  ipcRenderer.on('temos-changed', callback);
};

export const fetchStepsForTemo = (temoId: number) =>
  ipcRenderer.invoke('fetch-steps-for-temo', temoId);

export const saveAudio = (audioBuffer: ArrayBuffer) =>
  ipcRenderer.invoke('save-audio', audioBuffer);

export const generateArticle = ({
  sessionId,
  customPrompt,
}: {
  sessionId: string;
  customPrompt: string;
}) => ipcRenderer.invoke('generate-article', {sessionId, customPrompt});

export const updateArticle = (params: {article: string; customPrompt: string; sessionId: string}) =>
  ipcRenderer.invoke('update-article', params);

export const publishToGithub = (params: {temoId: number}) =>
  ipcRenderer.invoke('push-to-github', params);

export const publishToVercel = (params: {temoId: number}) =>
  ipcRenderer.invoke('push-to-vercel', params);
export const unPublishFromVercel = (params: {temoId: number}) =>
  ipcRenderer.invoke('unpublish-from-vercel', params);
export const saveConfig = (config: Config) => ipcRenderer.invoke('save-config', config);
export const fetchVercelHostName = (blobToken: string) =>
  ipcRenderer.invoke('fetch-vercel-hostname', blobToken);
export const updateBrandConfig = () => ipcRenderer.invoke('update-brand-config');

export const readConfig = () => ipcRenderer.invoke('read-config');

export const saveGuide = (sessionId: string, guideContent: string) =>
  ipcRenderer.invoke('save-guide', sessionId, guideContent);

export const transcribeAudio = (mp3FilePath: string) =>
  ipcRenderer.invoke('transcribe-audio', mp3FilePath);
export const updateTranscription = (sessionId: string, transcription: string) =>
  ipcRenderer.invoke('save-transcription', sessionId, transcription);

export const translateArticle = (sessionId: string, language: string) =>
  ipcRenderer.invoke('translate-article', sessionId, language);

export const openLink = (url: string) => ipcRenderer.invoke('open-link', url);
export const testLLMConnection = (config: any) => ipcRenderer.invoke('test-llm-connection', config);

export const saveBrandImage = (imageBuffer: Buffer) =>
  ipcRenderer.invoke('save-image', imageBuffer);
