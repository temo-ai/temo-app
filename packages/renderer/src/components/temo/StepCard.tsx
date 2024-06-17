import type React from 'react';
interface StepCardProps {
  id: number;
  index: number;
  thumbnail: string;
  isSelected: boolean;
  setSelectedStep: (id: number) => void;
  step: {
    id: number;
    goto: number;
  };
  playerRef: any;
  setActiveTab: (activeTab: string) => void;
}

const StepCard: React.FC<StepCardProps> = ({
  index,
  thumbnail,
  isSelected,
  setSelectedStep,
  step,
  playerRef,

  setActiveTab,
}) => {
  const handleClick = () => {
    try {
      setActiveTab('player');
      playerRef.current?.goto(step.goto);
      playerRef.current.play();
      setSelectedStep(step?.id);
    } catch (error) {
      console.error('Error handling slide click:', error);
    }
  };

  return (
    <div className="flex flex-col relative">
      <button
        className={`rounded-lg border ${isSelected ? 'border-gray-200' : 'border-gray-600'}`}
        onClick={handleClick}
      >
        <img
          src={thumbnail}
          width={300}
          height={120}
          alt="board"
          className="rounded-lg"
        />
      </button>
    </div>
  );
};
export default StepCard;
