import type React from 'react';

import {RiRecordCircleLine} from 'react-icons/ri';

export const RecordingToggle: React.FC<{
  isOn: boolean;
  handleToggle: () => void;
}> = ({isOn, handleToggle}) => (
  <div className="flex h-full w-[190px] cursor-default appearance-none items-center justify-center gap-1.5 rounded-md border-0 text-center outline-none ">
    <div className="flex text-foreground"></div>
    <div
      className={`w-6 h-[14px] rounded-full p-1 flex items-center cursor-pointer ${
        isOn ? 'bg-[#6B53FF]' : 'bg-gray-400'
      }`}
      onClick={handleToggle}
    >
      <div
        className={`w-2 h-2 rounded-full bg-background transition ${isOn ? 'translate-x-3' : ''}`}
      ></div>
    </div>
    <div className="flex text-foreground">
      <RiRecordCircleLine className={isOn ? 'text-[#FF5C5C]' : ''} />
    </div>
  </div>
);
