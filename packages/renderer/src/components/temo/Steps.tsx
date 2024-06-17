import type React from 'react';

import {useEffect, useRef, useState} from 'react';

import {ChevronUp, ChevronDown} from 'lucide-react';
import {Button} from '../ui/button';
import StepCard from './StepCard';
import {fetchStepsForTemo} from '#preload';

interface SlidesProps {
  temoId: number;
  playerRef: any;
  startTime: number;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

interface Step {
  id: number;
  goto: number;
  timestamp: number;
  screenshotPath?: string;
}

const ScrollableStepList: React.FC<{
  steps: Step[];
  selectedStep: number | null;
  setSelectedStep: (id: number) => void;
  playerRef: any;
  setActiveTab: (activeTab: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}> = ({steps, selectedStep, setSelectedStep, playerRef, setActiveTab, scrollContainerRef}) => {
  return (
    <div
      ref={scrollContainerRef}
      className="pt-12 pb-12 px-2 w-full no-horizontal-scroll flex flex-col gap-y-4 h-[calc(100vh-160px)] bg-background overflow-auto"
    >
      {steps.map((item, index) => (
        <div
          key={item.id}
          className="flex w-full"
        >
          <StepCard
            setActiveTab={setActiveTab}
            thumbnail={`media://${item.screenshotPath?.replace(/\.png$/, '-sm.png')}`}
            index={index}
            isSelected={selectedStep === item.id}
            setSelectedStep={setSelectedStep}
            step={item}
            id={item.id}
            playerRef={playerRef}
          />
        </div>
      ))}
    </div>
  );
};

const Slides: React.FC<SlidesProps> = ({temoId, playerRef, startTime, setActiveTab}) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topGradientRef = useRef<HTMLDivElement>(null);
  const [, setIsPlayerPaused] = useState(true);

  const fetchSteps = async () => {
    const fetchedSteps = await fetchStepsForTemo(temoId);
    const stepss = fetchedSteps?.map((step: Step) => {
      return {
        ...step,
        goto: step.timestamp - startTime,
      };
    });
    setSelectedStep(stepss[0]?.id);
    console.log(stepss);
    setSteps(stepss);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current && topGradientRef.current) {
      topGradientRef.current.classList.toggle(
        'opacity-100',
        scrollContainerRef.current.scrollTop > 0,
      );
    }
  };

  useEffect(() => {
    if (temoId) {
      fetchSteps();
    }
  }, [temoId]);

  useEffect(() => {
    scrollContainerRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!steps) return;
    if (!startTime) return;

    playerRef.current?.play();
  }, [steps, selectedStep]);

  const goToNextSlide = () => {
    const currentIndex = steps.findIndex(step => step.id === selectedStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setSelectedStep(nextStepId);
      if (playerRef?.current) {
        playerRef?.current?.goto(steps[currentIndex + 1].goto);
        playerRef?.current?.play();
      }
    }
  };

  const goToPreviousSlide = () => {
    const currentIndex = steps.findIndex(step => step.id === selectedStep);
    if (currentIndex > 0) {
      const prevStepId = steps[currentIndex - 1].id;
      setSelectedStep(prevStepId);
      playerRef?.current?.goto(steps[currentIndex - 1].goto);
      playerRef?.current?.play();
    }
  };
  // Listen to the player's pause event
  useEffect(() => {
    const handlePause = () => {
      setIsPlayerPaused(true);
    };

    playerRef.current?.addEventListener('pause', handlePause);
  }, [playerRef]);

  return (
    <section className="w-[264px] font-lato overflow-x-hidden no-horizontal-scroll relative border border-border h-[calc(100vh-130px)] rounded-lg">
      <Button
        onClick={goToPreviousSlide}
        variant="ghost"
        className="absolute top-0 z-10 w-full"
      >
        <ChevronUp />
      </Button>
      {/* <Button onClick={() => setAutoPlay(!autoPlay)}>
        {autoPlay ? "Pause" : "Play"}
      </Button> */}
      <ScrollableStepList
        steps={steps}
        selectedStep={selectedStep}
        setSelectedStep={setSelectedStep}
        playerRef={playerRef}
        setActiveTab={setActiveTab}
        scrollContainerRef={scrollContainerRef}
      />
      <Button
        onClick={goToNextSlide}
        variant="ghost"
        className="absolute bottom-0 z-10 w-full"
      >
        <ChevronDown />
      </Button>
    </section>
  );
};

export default Slides;
