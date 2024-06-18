import {useAtomValue} from 'jotai';
import {userDataPathAtom} from '../../utils/atoms';

const VideoPlayer = ({sessionId}: {sessionId: string}) => {
  const userDataPath = useAtomValue(userDataPathAtom);
  const videoUrl = `video://${userDataPath}/temos/${sessionId}/video-cropped.webm`;
  console.log('videoUrl', videoUrl);

  return (
    <div className="w-[calc(100vw-300px)] aspect-video items-center justify-center flex">
      <video
        id="my-video"
        autoPlay
        muted
      >
        <source
          src={videoUrl}
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
