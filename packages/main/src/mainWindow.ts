import {app, BaseWindow, WebContentsView, protocol, net} from 'electron';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import db from './utils/database';
import setupIpcHandlers from './ipcHandlers';
import unhandled from 'electron-unhandled';

unhandled();

async function createWindow() {
  const baseWindow = new BaseWindow({
    width: 1920,
    minHeight: 720,
    minWidth: 1280,
    height: 1080,
    frame: false,
    // titleBarStyle: 'hidden',

    // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
  });

  const temoView = new WebContentsView({
    webPreferences: {
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      preload: join(app.getAppPath(), 'packages/preload/dist/index.mjs'),
    },
  });

  setupIpcHandlers(baseWindow, temoView);

  protocol.handle('media', async req => {
    const url = new URL(req.url);
    const extension = url.pathname.split('.').pop();
    if (extension === 'mp4' || extension === 'webm') {
      // @ts-ignore
      return handleMediaRequest(req, 'video/' + extension);
    } else if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      // @ts-ignore
      return handleMediaRequest(req, 'image/' + extension);
    } else {
      return new Response('Unsupported media type', {status: 415});
    }
  });
  if (import.meta.env.DEV) {
    temoView.webContents.openDevTools();
  }

  baseWindow.on('resize', () => {
    const {width, height} = baseWindow.getBounds();
    temoView.setBounds({x: 0, y: 0, width, height: height});
  });

  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    await temoView.webContents.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    await temoView.webContents.loadFile(
      fileURLToPath(new URL('./../../renderer/dist/index.html', import.meta.url)),
    );
  }
  baseWindow.contentView.addChildView(temoView);
  temoView.setBounds({x: 0, y: 0, width: 1920, height: 1080});

  try {
    await db.read();
  } catch (error) {
    console.error(error);
  }
  return baseWindow;
}

async function restoreOrCreateWindow() {
  let window = BaseWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

export default restoreOrCreateWindow;

const handleMediaRequest = async (req: Electron.ProtocolRequest, contentType: string) => {
  try {
    const url = new URL(req.url);
    const pathToMedia = url.pathname;
    const fileContent = await net.fetch(`file://${pathToMedia}`);
    return new Response(fileContent.body, {
      headers: {'Content-Type': contentType},
    });
  } catch (error) {
    console.log('File not found', error);
    return new Response('File not found', {status: 404});
  }
};
