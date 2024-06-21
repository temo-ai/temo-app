import {useAtomValue} from 'jotai';
import {userDataPathAtom} from '../../utils/atoms';

const VideoPlayer = ({sessionId}: {sessionId: string}) => {
  const userDataPath = useAtomValue(userDataPathAtom);
  const videoUrl = `video://${userDataPath}/temos/${sessionId}/video-cropped.webm`;
  console.log('videoUrl', videoUrl);

  return (
    <video
      id="my-video"
      autoPlay
      muted
      className="w-full h-full p-8"
    >
      <source
        src={videoUrl}
        type="video/webm"
      />
    </video>
  );
};

export default VideoPlayer;
