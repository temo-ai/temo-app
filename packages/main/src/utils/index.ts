import type {WebContentsView} from 'electron';

export const addHttps = (url: string): string => {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};

let frameConfig: any;

export const calculateFrameConfig = (temoView: WebContentsView) => {
  const {width, height} = temoView.getBounds();

  const aspectRatio = 16 / 9;
  let frameWidth = Math.floor(width - 300);
  let frameHeight = Math.floor(frameWidth / aspectRatio);
  if (frameHeight > height - 300) {
    frameHeight = Math.floor(height - 300);
    frameWidth = Math.floor(frameHeight * aspectRatio);
  }
  frameConfig = {
    originWidth: width,
    originHeight: height,
    width: Math.floor(frameWidth),
    height: Math.floor(frameHeight),
    x: Math.floor((width - frameWidth) / 2),
    y: Math.floor((height - frameHeight) / 2) + 48,
  };

  return frameConfig;
};
