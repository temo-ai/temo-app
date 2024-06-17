import {promises as fsPromises, existsSync, readdirSync} from 'fs';
import {Buffer} from 'buffer';
import {mkdir, writeFile} from 'fs/promises';
import {join, dirname} from 'path';
import {getFilePaths} from './getFilePaths';

export async function ensureDirectoryExists(directory: string): Promise<void> {
  try {
    if (!existsSync(directory)) {
      await mkdir(directory, {recursive: true});
    }
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
  }
}

export async function saveWebMFile(filePath: string, arrayBuffer: ArrayBuffer): Promise<void> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
  } catch (error) {
    console.error('Error saving WebM file:', error);
    throw error;
  }
}

export async function fetchImagesBase64(sessionId: string): Promise<string[]> {
  try {
    const {stepsPath} = getFilePaths(sessionId);
    const imageFiles = readdirSync(stepsPath).filter(file => file.endsWith('-sm.png'));

    return Promise.all(imageFiles.map(file => encodeImageToBase64(join(stepsPath, file))));
  } catch (error) {
    console.error('Error fetching images as Base64:', error);
    throw error;
  }
}

export async function saveGuideContent({
  filePath,
  content,
}: {
  filePath: string;
  content: string;
}): Promise<void> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    await fsPromises.writeFile(filePath, content, {flag: 'w'});
  } catch (error) {
    console.error('Error saving guide content:', error);
    throw error;
  }
}

export async function readGuideContent(filePath: string): Promise<string> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    return await fsPromises.readFile(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading guide content:', error);
    throw error;
  }
}

async function encodeImageToBase64(filePath: string): Promise<string> {
  try {
    await ensureDirectoryExists(dirname(filePath));
    const fileBuffer = await fsPromises.readFile(filePath);
    return Buffer.from(fileBuffer).toString('base64');
  } catch (error) {
    console.error('Error encoding image to Base64:', error);
    throw error;
  }
}

export async function saveGuide(sessionId: string, guideContent: string): Promise<void> {
  try {
    const {guideFilePath} = getFilePaths(sessionId);
    await ensureDirectoryExists(dirname(guideFilePath));
    await fsPromises.writeFile(guideFilePath, guideContent);
    console.log('Guide updated successfully:', guideFilePath);
  } catch (error) {
    console.error('Error saving guide:', error);
    throw error;
  }
}
