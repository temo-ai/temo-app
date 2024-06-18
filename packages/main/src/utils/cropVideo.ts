import {writeFile} from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import {Readable, Writable} from 'stream';
// @ts-ignore
import ffmpegPath from 'ffmpeg-static-electron';

export const cropVideo = async (
  videoBuffer: Buffer,
  videoFilePath: string,
  frameConfig: any,
): Promise<void> => {
  try {
    const {width, height, x, y} = frameConfig;
    console.log(`Cropping with width: ${width}, height: ${height}, x: ${x}, y: ${y + 20}`);

    if (videoBuffer.length === 0) {
      console.error('Video buffer is empty.');
      throw new Error('Video buffer is empty.');
    }

    const inputStream = new Readable();
    inputStream.push(videoBuffer);
    inputStream.push(null);

    const chunks: Buffer[] = [];
    const writableStream = new Writable({
      write(chunk: Buffer, encoding: string, callback: () => void) {
        chunks.push(chunk);
        callback();
      },
    });

    ffmpeg(inputStream)
      .setFfmpegPath(ffmpegPath?.path?.replace('app.asar', 'app.asar.unpacked') || '')
      .videoFilters(`crop=${width}:${height}:${x}:${y}`)
      .format('webm')
      .on('end', () => {
        const outputBuffer = Buffer.concat(chunks);
        console.log('Screen video cropped and saved to:', videoFilePath);
        writeFile(videoFilePath, outputBuffer);
      })
      .on('error', err => {
        console.error('FFmpeg error:', err);
        throw err;
      })
      .pipe(writableStream, {end: true});
  } catch (error) {
    console.error('Error cropping video:', error);
    throw error;
  }
};
