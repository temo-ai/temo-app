import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';
import db from '../utils/database';
import {getFilePaths} from './getFilePaths';
import fs from 'fs';
import {resizeAndSaveImage} from './resizeAndSaveImage';
import type {WebContentsView} from 'electron';
import Jimp from 'jimp';
import {dialog} from 'electron';

export async function saveStepScreenshot(
  view: WebContentsView,
  sessionId: string,
  temoId: number,
  clickX: number,
  clickY: number,
  timestamp: number,
) {
  try {
    const {stepsPath} = getFilePaths(sessionId);
    if (!fs.existsSync(stepsPath)) {
      await mkdir(stepsPath, {recursive: true});
    }

    const image = await view.webContents.capturePage();
    const originalBuffer = image.toPNG();
    const filename = `${sessionId}-${timestamp}.png`;
    const filePath = join(stepsPath, filename);

    const {width, height} = view.getBounds();
    console.log(`Web content dimensions: width=${width}, height=${height}`);

    // Resize the image to the viewport size
    const jimpImage = await Jimp.read(originalBuffer);
    jimpImage.resize(width, height);
    const resizedBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    const circleBuffer = await drawCircle(resizedBuffer, clickX, clickY, 50, width, height);

    await writeFile(filePath, circleBuffer);
    // Resize and save 1/4x and 1/2x versions
    await resizeAndSaveImage(circleBuffer, stepsPath, filename, 0.25);
    // await resizeAndSaveImage(originalBuffer, stepsPath, filename, 0.5);
    await db.read();
    db.data.steps.push({
      id: db.data.steps.length + 1,
      temoId,
      screenshotPath: filePath,
      clickX,
      clickY,
      timestamp,
    });
    await db.write();
  } catch (error) {
    dialog.showErrorBox('Error', 'Error saving step screenshot: ' + error);
    console.error('Error saving step screenshot:', error);
    throw error;
  }
}

async function drawCircle(
  buffer: Buffer,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
) {
  try {
    console.log(`Drawing circle at (${x}, ${y}) with radius ${radius}`);
    console.log(`Image dimensions: width=${width}, height=${height}`);

    const jimpImage = await Jimp.read(buffer);
    const circle = new Jimp(width, height, (err, image) => {
      if (err) throw err;
      image.scan(0, 0, width, height, function (xPos, yPos, idx) {
        const distance = Math.sqrt((xPos - x) ** 2 + (yPos - y) ** 2);
        if (distance < radius) {
          this.bitmap.data[idx] = 0; // Red
          this.bitmap.data[idx + 1] = 255; // Green
          this.bitmap.data[idx + 2] = 0; // Blue
          this.bitmap.data[idx + 3] = 255; // Alpha
        }
      });
    });

    jimpImage.composite(circle, 0, 0);
    const circleBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    return circleBuffer;
  } catch (error) {
    dialog.showErrorBox('Error', 'Error drawing circle: ' + error);
    console.error('Error drawing circle:', error);
    return buffer;
  }
}
