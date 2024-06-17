import type React from 'react';
import {useState} from 'react';
import {cn} from '../../utils';
import {X, Home} from 'lucide-react';
import TabHover from './tabhover';
import {useAtom} from 'jotai';
import {allTabsAtom, selectedTabIdAtom} from '../../utils/atoms';
import {Button} from '../ui/button';

const Tabs = () => {
  const [tabs, setTabs] = useAtom(allTabsAtom);
  const [currentTabId, setCurrentTabId] = useAtom(selectedTabIdAtom);

  const handleTabClose = (tabId: number, tabIndex: number) => {
    const newTabs = tabs?.filter(tab => tab?.id !== tabId);
    setTabs(newTabs);

    if (tabId === currentTabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      setCurrentTabId(newTabs[newActiveIndex]?.id || 0);
    }
  };

  return (
    <nav className="flex gap-2 pb-2 items-center max-w-[100vw] overflow-x-scroll">
      <HomeTab
        onSelect={() => setCurrentTabId(0)}
        isActive={currentTabId === null || currentTabId === 0}
      />
      {tabs?.map((tab, index) => (
        <StandardTab
          key={tab?.id}
          tab={tab}
          isActive={tab?.id === currentTabId}
          onSelect={() => setCurrentTabId(tab?.id)}
          onClose={() => handleTabClose(tab?.id, index)}
        />
      ))}
    </nav>
  );
};

const HomeTab: React.FC<{onSelect: () => void; isActive: boolean}> = ({onSelect, isActive}) => (
  <Tab
    tabName="Home"
    isHome
    isActive={isActive}
    onSelect={onSelect}
    icon={<Home className="w-4 h-4" />}
  />
);

const StandardTab: React.FC<{
  tab: {id: number; name: string};
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}> = ({tab, isActive, onSelect, onClose}) => (
  <Tab
    tabName={tab.name}
    isActive={isActive}
    onSelect={onSelect}
    onClose={onClose}
  />
);
const Tab: React.FC<{
  isHome?: boolean;
  tabName: string;
  isActive?: boolean;
  onSelect: () => void;
  onClose?: () => void;
  icon?: React.ReactNode;
}> = ({isHome, tabName, isActive, onSelect, onClose, icon}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  const tabButtonClasses = cn(
    'flex items-center group justify-between gap-4 text-foreground rounded-lg text-xs bg-[#0d0e130a] hover:bg-secondary transition',
    {
      'bg-background shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_2px_3px_0_rgba(103,110,144,0.12)] hover:bg-background':
        isActive,
    },
    {
      'w-[220px]': !isHome,
    },
    {
      'px-4': isHome,
    },
  );

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col group transition-all no-drag"
    >
      <Button
        className={tabButtonClasses}
        onClick={onSelect}
      >
        {icon ? icon : <span className="max-w-[202px] truncate">{tabName}</span>}

        {!isHome && (
          <div
            onClick={handleCloseClick}
            className="hidden group-hover:block"
          >
            <X className="w-4 h-4" />
          </div>
        )}
      </Button>
      {!isHome && isHovered && <TabHover tabName={tabName} />}
    </div>
  );
};

export default Tabs;
