import * as os from 'os';
import * as path from 'path';

let platform: string = os.platform();
// Patch for compatibility with electron-builder, for smart build process.
if (platform === 'darwin') {
  platform = 'mac';
} else if (platform === 'win32') {
  platform = 'win';
}
// Adding browser, for use case when module is bundled using browserify and added to HTML using src.
if (platform !== 'linux' && platform !== 'mac' && platform !== 'win' && platform !== 'browser') {
  console.error('Unsupported platform.', platform);
  process.exit(1);
}

const arch: string = os.arch();
if (platform === 'mac' && arch !== 'x64' && arch !== 'arm64') {
  console.error('Unsupported architecture.');
  process.exit(1);
}

export const ffmpegPath: string = path.join(
  __dirname,
  'bin',
  platform,
  arch,
  platform === 'win' ? 'ffmpeg.exe' : 'ffmpeg',
);
