import {join} from 'path';
import Jimp from 'jimp';

type ImageFormat = 'png' | 'jpeg';

export async function resizeAndSaveImage(
  buffer: Buffer,
  path: string,
  filename: string,
  scale: number,
  format: ImageFormat = 'png',
): Promise<void> {
  try {
    const sizeLabel = scale === 0.25 ? 'sm' : 'md';
    const newFilename = filename.replace(/\.(png|jpg|jpeg)$/, `-${sizeLabel}.${format}`);
    const newFilePath = join(path, newFilename);

    const image = await Jimp.read(buffer);
    const resizedWidth = Math.round(scale * image.getWidth());
    image.resize(resizedWidth, Jimp.AUTO);
    if (format === 'jpeg') {
      image.quality(50);
    }
    image.write(newFilePath);
  } catch (error) {
    console.error('Error resizing and saving image:', error);
    throw new Error('Failed to resize and save image');
  }
}
