import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import ffmpegPath from 'ffmpeg-static-electron';

export async function convertWebMToMP3(sourcePath: string, destinationPath: string) {
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(sourcePath)
        .setFfmpegPath(ffmpegPath?.path?.replace('app.asar', 'app.asar.unpacked') || '')
        .toFormat('mp3')
        .on('error', (err: any) => {
          console.error('Error converting audio:', err);
          reject(err);
        })
        .on('end', () => {
          // console.log("Audio conversion completed.");
          resolve(null);
        })
        .save(destinationPath);
    });
  } catch (error) {
    console.error('Error converting WebM to MP3:', error);
  }
}
