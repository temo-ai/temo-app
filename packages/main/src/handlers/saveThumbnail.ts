import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';
import fs from 'fs';
import type {BrowserView} from 'electron';
import {resizeAndSaveImage} from './resizeAndSaveImage';
import {getFilePaths} from './getFilePaths';

export async function saveThumbnail(view: BrowserView, sessionId: string) {
  try {
    const {thumbnailFileDir} = getFilePaths(sessionId);
    if (!fs.existsSync(thumbnailFileDir)) {
      await mkdir(thumbnailFileDir, {recursive: true});
    }

    const image = await view.webContents.capturePage();
    const originalBuffer = image.toPNG();
    const filename = `${sessionId}.png`;
    const filePath = join(thumbnailFileDir, filename);

    // Save original image (1x)
    await writeFile(filePath, originalBuffer);
    // console.log("Screenshot saved to", filePath);
    // Resize and save 1/4x and 1/2x versions
    await resizeAndSaveImage(originalBuffer, thumbnailFileDir, filename, 0.25);
    // await resizeAndSaveImage(originalBuffer, thumbnailFileDir, filename, 0.5);
  } catch (error) {
    console.error('Error saving thumbnail:', error);
  }
}
