import {ipcMain, WebContentsView as TemoView, desktopCapturer, app} from 'electron';
import type {BaseWindow, WebContentsView} from 'electron';
import {join} from 'path';
import {writeFile} from 'fs/promises';
import {ensureScreenCapturePermissions} from './utils/system-permissions';
import {saveGuide} from './handlers/events';
import {transcribeAudio} from './handlers/transcribeAudio';
import {saveThumbnail} from './handlers/saveThumbnail';
import {save} from './handlers/saveTemo';
import {generateArticle, translateArticle, updateArticle} from './handlers/generateArticle';
import {handleFetchEvent} from './handlers/handleFetchEvent';
import {handleSaveEvents} from './handlers/handleSaveEvents';
import {saveStepScreenshot} from './handlers/saveStepScreenshot';
import {updateTranscription} from './handlers/saveTranscription';
import {
  createTemoSession,
  fetchTemos,
  fetchTemo,
  deleteTemo,
  updateTemo,
  fetchStepsForTemo,
  updateTemoChatHistory,
} from './handlers/temo';
import {
  updateTemoFolder,
  fetchTemoFolder,
  removeFromFolder,
  createFolder,
  fetchFolders,
  fetchFolder,
  deleteFolder,
} from './handlers/folders';
import {getFilePaths} from './handlers/getFilePaths';
import {fetchFiles} from './handlers/fetchFiles';
import {deleteAllTemos} from './handlers/temo';
import {testLLMConnection} from './handlers/ai';
import {readConfigFile, userDataPath, configPath} from './utils/constants';
import {
  publishToGithub,
  publishToVercel,
  unpublishFromVercel,
  fetchVercelHostName,
  updateBrandConfig,
} from './utils/publish';
import {addHttps, calculateFrameConfig} from './utils';

import {cropVideo} from './utils/cropVideo';

let EVENTS: any[] = [];
let frameConfig: any;

export default function setupIpcHandlers(baseWindow: BaseWindow, temoView: WebContentsView) {
  let temoId: number;
  let temoSessionId: string;
  let RecordingBrowserView: WebContentsView;
  let validatedUrl: string;
  let urls: string = 'https://github.com/';
  let pageTitle: string = '';
  let RECORDING = false;

  ipcMain.handle('load-url', async (_, url) => {
    if (url) {
      urls = url;
    } else {
      // url = last visited url
      url = urls;
    }
    validatedUrl = addHttps(url);

    EVENTS = [];

    if (RecordingBrowserView) {
      RecordingBrowserView.webContents.loadURL(validatedUrl);
    } else {
      RecordingBrowserView = new TemoView({
        webPreferences: {
          preload: join(app.getAppPath(), '/packages/preload/dist/rrweb.js'),
        },
      });
    }
    // RecordingBrowserView.webContents.on('did-finish-load', () => {
    //   RecordingBrowserView.webContents.executeJavaScript(`
    //     document.addEventListener('click', (event) => {
    //       const clickX = event.clientX;
    //       const clickY = event.clientY;
    //       window.electron.sendClickEvent(clickX, clickY);
    //     });
    //   `);
    // });

    // baseWindow.on('resize', () => {
    //   frameConfig = calculateFrameConfig(temoView);
    //   RecordingBrowserView.setBounds({
    //     x: frameConfig.x,
    //     y: frameConfig.y,
    //     width: frameConfig.width,
    //     height: frameConfig.height,
    //   });
    // });

    baseWindow.contentView.addChildView(RecordingBrowserView);

    // RecordingBrowserView.setBackgroundColor("#fff");
    // RecordingBrowserView.webContents.openDevTools();
    // updateRecordingBrowserViewBounds();

    frameConfig = calculateFrameConfig(temoView);
    console.log(frameConfig);
    RecordingBrowserView.setBounds({
      x: frameConfig.x,
      y: frameConfig.y,
      width: frameConfig.width,
      height: frameConfig.height,
    });
    try {
      RecordingBrowserView.webContents.loadURL(validatedUrl);
    } catch (error) {
      console.error('Error loading URL:', error);
    }
    // RecordingBrowserView.webContents. did - navigate;
    RecordingBrowserView.webContents.on('did-start-navigation', (event: any) => {
      // console.log("did-start-navigation", event);
      if (event?.isMainFrame) {
        if (event?.url !== 'about:blank') {
          urls = event?.url;
          temoView.webContents.send('url-navigated', event?.url);
        }
      }
    });

    RecordingBrowserView.webContents.on('page-title-updated', (event: any, title: any) => {
      pageTitle = title;

      temoView.webContents.send('update-title', title);
    });
  });

  ipcMain.handle('send-click-event', (event, clickX, clickY) => {
    console.log('Click event:', {clickX, clickY});
    // Trigger your desired event here with clickX and clickY
  });

  ipcMain.handle('update-modal-size', () => {
    const frameConfig = calculateFrameConfig(temoView);
    return frameConfig;
  });

  ipcMain.handle('start-recording', async () => {
    try {
      const temoName = pageTitle;
      const {id, sessionId} = await createTemoSession(temoName);
      console.log('id', id);
      console.log('sessionId', sessionId);
      temoId = id;
      temoSessionId = sessionId;
      saveThumbnail(RecordingBrowserView, temoSessionId);
      RECORDING = true;
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  });

  ipcMain.handle('stop-recording', async () => {
    try {
      RECORDING = false;
      await handleSaveEvents(temoId, temoSessionId, EVENTS);
      EVENTS = [];
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  });

  ipcMain.on('record-event', (event: any, recordedEvent) => {
    if (RECORDING) {
      if (recordedEvent?.type === 3 && recordedEvent?.data?.type === 1) {
        const clickX = recordedEvent?.data?.x;
        const clickY = recordedEvent?.data?.y;
        const timestamp = recordedEvent.timestamp;
        if (clickX && clickY && timestamp) {
          console.log('clickX', clickX, 'clickY', clickY, 'timestamp', timestamp);
          saveStepScreenshot(
            RecordingBrowserView,
            temoSessionId,
            temoId,
            clickX,
            clickY,
            timestamp,
          );
        }
      }
    }
    EVENTS.push(recordedEvent); // Only push events when RECORDING is true
  });

  ipcMain.handle('close-recorder', () => {
    try {
      baseWindow.contentView.removeChildView(RecordingBrowserView);
      temoView.webContents.send('temos-changed');
    } catch (error) {
      console.error('Error closing recorder:', error);
    }
  });

  ipcMain.handle('get-user-data-path', () => {
    return userDataPath;
  });

  ipcMain.handle('go-back', () => {
    if (RecordingBrowserView.webContents.canGoBack()) {
      RecordingBrowserView.webContents.goBack();
    }
  });

  ipcMain.handle('go-forward', () => {
    if (RecordingBrowserView.webContents.canGoForward()) {
      RecordingBrowserView.webContents.goForward();
    }
  });

  ipcMain.handle('reload-page', () => {
    RecordingBrowserView.webContents.reload();
  });

  ipcMain.handle('is-loading', () => {
    return RecordingBrowserView.webContents.isLoading();
  });

  ipcMain.on('fetch-events', event => {
    event.reply('send-recorded-events', EVENTS);
  });

  ipcMain.handle('fetch-temos', fetchTemos);

  ipcMain.handle('fetch-temo', async (_, id) => {
    console.log('fetch-temo', id);
    try {
      const temo = await fetchTemo(id);

      const sessionId = temo?.sessionId;
      if (!sessionId) {
        return null;
      }
      const events = await handleFetchEvent(sessionId);
      const {transcription, guide, mp3FilePath, articles} = await fetchFiles(sessionId);
      return {
        ...temo,
        events,
        transcription,
        guide,
        articles,
        mp3FilePath,
      };
    } catch (error) {
      console.error('Error fetching temo from database:', error);
      return null;
    }
  });

  ipcMain.handle('delete-temo', async (_, id: number) => {
    await deleteTemo(id);
    temoView.webContents.send('temos-changed');
  });

  ipcMain.handle('update-temo', async (_, id: number, newName: string) => {
    return await updateTemo(id, newName);
  });

  ipcMain.handle('update-temo-chat-history', (_, params) => updateTemoChatHistory(params));
  ipcMain.handle('delete-all-temos', deleteAllTemos);

  ipcMain.handle('update-temo-folder', updateTemoFolder);
  ipcMain.handle('remove-from-folder', removeFromFolder);

  ipcMain.handle('fetch-temo-folder', fetchTemoFolder);

  ipcMain.handle('create-folder', createFolder);

  ipcMain.handle('fetch-folders', fetchFolders);

  ipcMain.handle('fetch-folder', fetchFolder);

  ipcMain.handle('fetch-steps-for-temo', async (_, temoId: number) => {
    return await fetchStepsForTemo(temoId);
  });

  ipcMain.handle('save-audio', async (event, audioBuffer) => {
    return save(temoSessionId, audioBuffer, temoView);
  });

  ipcMain.handle('generate-article', async (event, params) => {
    return await generateArticle(params);
  });

  ipcMain.handle('update-article', async (event, params) => {
    return await updateArticle(params);
  });

  ipcMain.handle('push-to-github', async (event, params) => {
    return await publishToGithub(params);
  });

  ipcMain.handle('push-to-vercel', async (event, params) => {
    return await publishToVercel(params);
  });

  ipcMain.handle('save-config', async (_, config) => {
    return await writeFile(configPath, JSON.stringify(config));
  });

  ipcMain.handle('fetch-vercel-hostname', async (_, blobToken: string) => {
    return await fetchVercelHostName(blobToken);
  });

  ipcMain.handle('update-brand-config', async () => {
    return await updateBrandConfig();
  });

  ipcMain.handle('read-config', async () => {
    return await readConfigFile();
  });

  ipcMain.handle('save-guide', async (event, sessionId: string, guideContent: string) => {
    return await saveGuide(sessionId, guideContent);
  });
  ipcMain.handle('transcribe-audio', async (_, sessionId) => {
    try {
      const {transcriptionFilePath, mp3FilePath} = getFilePaths(sessionId);
      const transcription = await transcribeAudio(mp3FilePath);
      if (transcription) {
        await writeFile(transcriptionFilePath, transcription);
      }
      return transcription;
    } catch (error) {
      console.error('Error in IPC handler for transcribing audio:', error);
      return '';
    }
  });
  ipcMain.handle('delete-folder', deleteFolder);
  ipcMain.handle('save-transcription', async (_, sessionId, transcription) => {
    return await updateTranscription(sessionId, transcription);
  });

  ipcMain.handle('translate-article', async (_, sessionId, language) => {
    const res = await translateArticle({sessionId, language});
    temoView.webContents.send('temos-changed');

    return res;
  });
  ipcMain.handle('test-llm-connection', async (_, config) => {
    return await testLLMConnection(config);
  });
  ipcMain.handle('unpublish-from-vercel', async (event, params) => {
    return await unpublishFromVercel(params);
  });

  ipcMain.handle('record-screen-video', async () => {
    await ensureScreenCapturePermissions();
    const sources = await desktopCapturer.getSources({
      types: ['window'],
    });
    console.log(
      'Sources:',
      sources?.map(source => source.name),
    ); // Log the sources to verify
    if (sources.length === 0) {
      throw new Error('No screens found for capturing.');
    }
    const screenSource = sources?.find(source => source.name === 'temo' || source.name === 'Temo');
    temoView.webContents.send('screen-source-id', screenSource?.id);
  });

  ipcMain.handle('save-screen-video', async (event, videoBufferArray) => {
    try {
      // saveTemo(temoSessionId, mainWindow);
      const {originalVideoFilePath, croppedVideoFilePath} = getFilePaths(temoSessionId);
      const videoBuffer = Buffer.from(videoBufferArray);
      await writeFile(originalVideoFilePath, videoBuffer);
      console.log('Screen video saved to:', originalVideoFilePath);
      console.log(frameConfig, cropVideo);
      await cropVideo(videoBuffer, croppedVideoFilePath, frameConfig);
    } catch (error) {
      console.error('Error saving screen video:', error);
    }
  });

  ipcMain.handle('save-image', async (_, imageBuffer) => {
    try {
      const filePath = userDataPath + `/brand-${Date.now()}.png`;
      await writeFile(filePath, imageBuffer);
      console.log('Image saved to:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  });
}
