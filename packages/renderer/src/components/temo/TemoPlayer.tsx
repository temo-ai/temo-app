import type React from 'react';
import {useEffect, useRef} from 'react';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

interface TemoPlayerProps {
  playerRef: React.MutableRefObject<any>;
  setStartTime: (time: number) => void;
  recordedEvents: any[];
  openComponent: number;
}

const TemoPlayer: React.FC<TemoPlayerProps> = ({
  playerRef,
  setStartTime,
  recordedEvents,
  openComponent,
}) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const replayEvents = async (events: any[]) => {
    const playerElement = playerContainerRef.current;
    if (playerElement) {
      if (playerRef?.current) {
        playerRef.current.pause();
        playerElement.innerHTML = '';
        playerRef.current = null;
      }
      if (events?.length > 2) {
        const rect = playerElement.getBoundingClientRect();
        const customWidth = rect.width;
        const customHeight = rect.height;

        const firstEventtimestamp = events[0].timestamp;
        setStartTime(firstEventtimestamp);
        playerRef.current = new rrwebPlayer({
          target: playerElement,
          props: {
            events: events,
            width: customWidth - 40,
            height: customHeight,
            showController: false,
            showDebug: false,
            autoPlay: true,
          },
        });
      }
    }
  };

  useEffect(() => {
    replayEvents(recordedEvents);
  }, [recordedEvents, openComponent]);

  return (
    <div
      ref={playerContainerRef}
      id="rrweb-player"
      className="flex h-full bg-background"
    />
  );
};

export default TemoPlayer;
