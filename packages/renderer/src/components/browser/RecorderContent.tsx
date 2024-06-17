import {useEffect, useState, useCallback} from 'react';
import {RiRecordCircleLine} from 'react-icons/ri';
import {Button} from '../ui/button';
import {UrlInput} from './UrlInput';
import {RecorderControls} from './RecorderControls';
import {
  onUrlNavigated,
  onScreenSourceId,
  startRecording,
  stopRecording,
  saveScreenVideo,
  saveAudio,
  recordScreenVideo as recordScreenVideoPreload,
  loadUrl as loadUrlPreload,
} from '#preload';

interface RecorderContentProps {
  url: string;
  setUrl: (url: string) => void;
}

let mediaRecorder: MediaRecorder | null = null;

const RecorderContent = ({url, setUrl}: RecorderContentProps) => {
  const [recording, setRecording] = useState(false);

  const loadUrl = useCallback(async () => {
    await loadUrlPreload(url);
  }, [url]);

  useEffect(() => {
    onUrlNavigated((navigatedUrl: string) => {
      setUrl(navigatedUrl);
    });
    loadUrl();
  }, []);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <div className="flex flex-col w-full mt-1">
      <Header
        url={url}
        handleUrlChange={handleUrlChange}
        recording={recording}
        setRecording={setRecording}
      />
    </div>
  );
};

const Header = ({
  url,
  handleUrlChange,
  recording,
  setRecording,
}: {
  url: string;
  handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  recording: boolean;
  setRecording: (recording: boolean) => void;
}) => {
  return (
    <div className="flex bg-background p-2 rounded-t-lg border-b border-border w-full justify-between gap-2">
      <div className="flex items-center w-full">
        <RecorderControls />
        <UrlInput
          url={url}
          handleUrlChange={handleUrlChange}
        />
      </div>
      <div className="flex items-center">
        <Button
          onClick={() =>
            recordScreenVideo({
              recording,
              setRecording,
            })
          }
          className="p-2 gap-1"
        >
          <RiRecordCircleLine className="" />
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>
    </div>
  );
};

async function recordScreenVideo({
  recording,
  setRecording,
}: {
  recording: boolean;
  setRecording: (recording: boolean) => void;
}) {
  if (recording) {
    console.log('Stopping recording');
    mediaRecorder?.stop();
  } else {
    setRecording(true);
    recordScreenVideoPreload();
    onScreenSourceId(async (sourceId: string) => {
      startRecording();

      try {
        // Get screen stream
        const screenStream = await navigator.mediaDevices.getUserMedia({
          video: {
            // @ts-ignore
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              minWidth: 1920,
              maxWidth: 1920,
              minHeight: 1080,
              maxHeight: 1080,
            },
          },
        });

        // Get audio stream
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: {exact: 'default'},
          },
        });
        // Combine both streams
        const combinedStream = new MediaStream([
          ...screenStream.getTracks(),
          ...audioStream.getTracks(),
        ]);

        // Initialize MediaRecorder with the combined stream
        mediaRecorder = new MediaRecorder(combinedStream);
        const videoChunks: Blob[] = [];
        const audioChunks: Blob[] = [];
        mediaRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            videoChunks.push(event.data);
          }
        };

        // Separate MediaRecorder for audio only
        const audioRecorder = new MediaRecorder(audioStream);
        audioRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async function () {
          const videoBlob = new Blob(videoChunks, {type: 'video/webm'});
          const videoBuffer = await blobToArrayBuffer(videoBlob);
          await stopRecording();
          saveScreenVideo(videoBuffer);
          stopScreenVideo(combinedStream); // Ensure to stop both video and audio tracks
          console.log('Captured combined screen and audio video:', videoBuffer);
          setRecording(false);

          // Stop and save audio separately
          audioRecorder.stop();
        };

        audioRecorder.onstop = async function () {
          const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
          const audioBuffer = await blobToArrayBuffer(audioBlob);
          saveAudio(audioBuffer);
          console.log('Captured audio:', audioBuffer);
        };

        mediaRecorder.start();
        audioRecorder.start(); // Start recording audio separately
      } catch (error) {
        console.error('Error capturing screen and audio:', error);
      }
    });
  }
}

function stopScreenVideo(stream: MediaStream) {
  if (stream && stream.getTracks) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
    console.log('Screen and microphone access stopped.');
  } else {
    console.error('No active media stream found.');
  }
}

export default RecorderContent;

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
