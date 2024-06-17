import {join} from 'path';
import {userDataPath} from '../utils/constants';

interface FilePaths {
  originalVideoFilePath: string;
  croppedVideoFilePath: string;
  articlesDir: string;
  audioDir: string;
  stepsPath: string;
  eventsDir: string;
  eventsFilePath: string;
  webmFilePath: string;
  mp3FilePath: string;
  transcriptionFilePath: string;
  guideFilePath: string;
  sessionId: string;
  thumbnailFileDir: string;
  thumbnailFilePath: string;
  brandImageFilePath: string;
}

export function getFilePaths(sessionId: string | undefined): FilePaths {
  if (!sessionId) {
    throw new Error('Invalid session ID');
  }
  const originalVideoFilePath = join(userDataPath, 'temos', sessionId, 'video.webm');
  const croppedVideoFilePath = join(userDataPath, 'temos', sessionId, 'video-cropped.webm');
  const articlesDir = join(userDataPath, 'temos', sessionId, 'articles');
  const audioDir = join(userDataPath, 'temos', sessionId, 'files');
  const stepsPath = join(userDataPath, 'temos', sessionId, 'steps');
  const eventsDir = join(userDataPath, 'temos', sessionId, 'events');
  const eventsFilePath = join(eventsDir, 'events.json');
  const thumbnailFileDir = join(userDataPath, 'temos', sessionId, 'thumbnails');
  const thumbnailFilePath = join(thumbnailFileDir, `${sessionId}-sm.png`);
  const brandImageFilePath = join(userDataPath, 'brand.png');
  return {
    originalVideoFilePath,
    croppedVideoFilePath,
    articlesDir,
    audioDir,
    stepsPath,
    eventsDir,
    thumbnailFileDir,
    eventsFilePath,
    webmFilePath: join(audioDir, 'audio.webm'),
    mp3FilePath: join(audioDir, 'audio.mp3'),
    transcriptionFilePath: join(audioDir, 'transcription.txt'),
    guideFilePath: join(articlesDir, 'ENGLISH.md'),
    sessionId,
    thumbnailFilePath,
    brandImageFilePath,
  };
}
