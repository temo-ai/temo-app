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
        className={`rounded-lg outline outline-offset-1 outline-gray-100 border-2 border-red-500 ${
          isSelected ? 'outline-green-800' : ''
        }`}
        onClick={handleClick}
      >
        <img
          src={thumbnail}
          width={300}
          height={120}
          alt="board"
          className="rounded-lg"
        />
        <span className="absolute bottom-0 right-0 p-1 text-sm bg-white bg-opacity-75 rounded-full">
          {index + 1}
        </span>
      </button>
    </div>
  );
};
export default StepCard;
