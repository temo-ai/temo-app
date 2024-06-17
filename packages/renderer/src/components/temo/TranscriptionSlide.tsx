import {useState, useEffect} from 'react';
import {Label} from '../ui/label';
import {Textarea} from '../ui';
import {Button} from '../ui/button';
import {Separator} from '../ui/separator';
import {toast} from 'sonner';
import {selectedTabIdAtom, fetchTemo} from '../../utils/atoms';
import {useAtomValue} from 'jotai';
import {
  generateGuide as generateGuidePreload,
  updateTranscription as updateTranscriptionPreload,
} from '#preload';

const TranscriptionSlide = ({
  transcription,

  sessionId,
}: ShareModalProps) => {
  const [transcript, setTranscription] = useState('');
  const selectedTabId = useAtomValue(selectedTabIdAtom);
  const [loading, setLoading] = useState(false);

  const updateTranscription = async () => {
    console.log('saving transcription', {transcript});
    try {
      await updateTranscriptionPreload(sessionId, transcript);
      toast.success('Transcription saved successfully!');
    } catch (error) {
      console.error('Failed to save transcription:', error);
    }
  };

  const generateGuide = async () => {
    setLoading(true);
    const myPromise = generateGuidePreload(sessionId);
    toast.promise(myPromise, {
      loading: 'Generating Article...',
      success: () => {
        return 'Article generated successfully!';
      },
      error: error => {
        return error.message;
      },
    });
    try {
      await myPromise;
      fetchTemo(selectedTabId);
    } catch (error) {
      console.error('Failed to generate guide:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTranscription(transcription);
  }, [transcription]);

  return (
    <div className="p-2">
      <Label
        htmlFor="message"
        className="sr-only"
      >
        Instructions
      </Label>
      <Textarea
        id="message"
        placeholder="Recorded Audio..."
        value={transcript}
        onChange={e => setTranscription(e.target.value)}
        className="min-h-[300px] resize-none focus-visible:ring-0"
      />
      <Button
        disabled={transcript === transcription}
        onClick={updateTranscription}
        className="mt-4"
      >
        Save
      </Button>

      <Separator
        className="my-4"
        decorative
      />
      <Button
        onClick={generateGuide}
        disabled={loading}
        className="mt-4"
        loading={loading}
      >
        ReGenerate Guide
      </Button>
    </div>
  );
};

export default TranscriptionSlide;

interface ShareModalProps {
  transcription: string;
  sessionId: string;
}

interface AudioControlsProps {
  mp3FilePath: string;
}

const AudioControls = ({mp3FilePath}: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const handlePlayPause = () => {
    console.log({mp3FilePath});
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const playHandler = () => setIsPlaying(true);
    const pauseHandler = () => setIsPlaying(false);

    audio?.addEventListener('play', playHandler);
    audio?.addEventListener('pause', pauseHandler);

    return () => {
      audio?.removeEventListener('play', playHandler);
      audio?.removeEventListener('pause', pauseHandler);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={mp3FilePath}
      />
      <Button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</Button>
    </>
  );
};

// const TranscriptionControls = ({
//   transcript,
//   handleTranscribe,
// }: {
//   transcript: string;
//   handleTranscribe: () => void;
// }) => (
//   <div className="flex items-center p-3 pt-0 justify-between">
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//         >
//           <Paperclip className="size-4" />
//           <span className="sr-only">Attach file</span>
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent side="top">Attach File</TooltipContent>
//     </Tooltip>

//     {(transcript || transcript === 'undefined') && (
//       <Button
//         onClick={handleTranscribe}
//         variant="outline"
//       >
//         Transcribe
//       </Button>
//     )}
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//         >
//           <Mic className="size-4" />
//           <span className="sr-only">Use Microphone</span>
//         </Button>
//       </TooltipTrigger>
//       <TooltipContent side="top">Use Microphone</TooltipContent>
//     </Tooltip>
//   </div>
// );
