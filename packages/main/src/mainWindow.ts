import {app, BaseWindow, WebContentsView, protocol, net} from 'electron';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import db from './utils/database';
import setupIpcHandlers from './ipcHandlers';
import unhandled from 'electron-unhandled';

unhandled();

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'video',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true,
    },
  },
]);
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
  registerLocalVideoProtocol();
  registerImageProtocol();

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

const handleMediaRequest = async (req: Request, contentType: string) => {
  try {
    console.log('req', req);
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
function registerLocalVideoProtocol() {
  // @ts-ignore
  protocol.handle('video', async (request: Request) => {
    try {
      const url = new URL(request.url);
      const extension = url.pathname.split('.').pop();
      if (extension === 'mp4' || extension === 'webm') {
        return handleMediaRequest(request, 'video/' + extension);
      } else {
        return new Response('Unsupported media type', {status: 415});
      }
    } catch (error) {
      console.error('Error handling media request', error);
      return new Response('Internal server error', {status: 500});
    }
  });
}

function registerImageProtocol() {
  protocol.handle('media', async (request: Request) => {
    try {
      const url = new URL(request.url);
      const extension = url.pathname.split('.').pop();
      if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
        return handleMediaRequest(request, 'image/' + extension);
      } else {
        return new Response('Unsupported media type', {status: 415});
      }
    } catch (error) {
      console.error('Error handling media request', error);
      return new Response('Internal server error', {status: 500});
    }
  });
}
