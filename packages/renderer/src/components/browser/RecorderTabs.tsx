import type React from 'react';
import {cn} from '../../utils';

interface RecorderTabsProps {
  tab: {
    id: number;
    title: string;
    url: string; // Assuming you now store URL with the tab for identification
  };
  activeTab: number;
  onTabClick: (tabId: number) => void;
}

const RecorderTabs: React.FC<RecorderTabsProps> = ({tab, activeTab, onTabClick}) => {
  return (
    <button
      onClick={() => onTabClick(tab.id)}
      className={cn(
        'relative flex items-center justify-between gap-2.5 pl-3.5 bg-background h-full w-[256px] rounded-t-lg rounded-b-lg text-xs pr-2',
        {
          'bg-[#0d0e130a] hover:bg-[#0d0e1312] transition': tab.id !== activeTab,
        },
      )}
    >
      <p className="max-w-[256px] truncate">{tab.title || 'New tab'}</p>

      {tab.id !== 1 && (
        <span
          className="ml-2 text-accent"
          onClick={e => {
            e.stopPropagation();
            // onCloseTab(tab.id);
          }}
        >
          &#10005;
        </span>
      )}
    </button>
  );
};
export default RecorderTabs;
