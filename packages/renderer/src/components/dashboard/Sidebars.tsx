import type React from 'react';

import Recorder from '../browser/Recorder';

import {Home, Settings, Search, Folder, Clock} from 'lucide-react';
import {Input, Button, Separator} from '../ui';
import {isCommandMenuOpenAtom} from '../../utils/atoms';

import ThemeModeToggle from './ThemeModeToggle';
import {useAtom, useAtomValue} from 'jotai';
import {selectedFolderIdAtom, selectedPageAtom, allTemosCountAtom} from '../../utils/atoms';
import Onboarding from './Onboarding';
import FolderList from '../folders/FoldersList';
import FolderModal from '../folders/FolderModal';

import {useTheme} from '../helper/theme-provider';
import temoLight from '../../../assets/temo-light.png';
import temoDark from '../../../assets/temo-dark.png';

export default function Sidebar() {
  const [, setSelectedFolder] = useAtom<number | null>(selectedFolderIdAtom);
  const allTemosCount = useAtomValue(allTemosCountAtom);
  return (
    <>
      <div className="flex flex-col justify-between w-[264px] left-2 top-[48px] font-lato  border-r border-border overflow-auto p-4">
        <div className="flex flex-col gap-y-3">
          <div className="flex justify-between">
            <AccountSection />
            <div>
              <ThemeModeToggle />
            </div>
          </div>
          <Recorder />
          <SearchAndCommands />
          <SidebarItem
            name="Browse All"
            link="HOME"
            count={allTemosCount}
            icon={<Home className="w-4 h-4" />}
            onClick={() => setSelectedFolder(null)}
          />
          <SidebarItem
            name="Recent"
            link="RECENT"
            icon={<Clock className="w-4 h-4" />}
            onClick={() => setSelectedFolder(null)}
          />

          <Separator />

          <div className="items-center flex rounded-lg justify-between pl-2">
            <div className="flex items-center justify-between text-muted-foreground w-full">
              <div className="flex gap-x-2 items-center">
                <Folder className="w-4 h-4" />
                <span className="">Collections</span>
              </div>
              <FolderModal />
            </div>
          </div>
          <FolderList />
        </div>
        <div className="flex flex-col gap-y-2">
          <Onboarding />
          <Separator />
          {/* <SidebarItem
            name="Branding"
            link="BRANDING"
            icon={<Brush size={20} />}
          /> */}
          <SidebarItem
            name="Settings"
            link="SETTINGS"
            icon={<Settings size={20} />}
          />
        </div>
      </div>
    </>
  );
}

const AccountSection: React.FC = () => {
  const {resolvedTheme} = useTheme();
  return (
    <div className="flex flex-row justify-center items-center">
      <img
        src={resolvedTheme === 'light' ? temoLight : temoDark}
        alt="temoLogo"
        width={80}
      />
    </div>
  );
};

const SearchAndCommands: React.FC = () => {
  const [commandMenuOpen, setCommandMenuOpen] = useAtom(isCommandMenuOpenAtom);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search & commands"
        className="pl-8"
        onClick={() => setCommandMenuOpen(!commandMenuOpen)}
      />
    </div>
  );
};

interface SidebarItemProps {
  name: string;
  link: string;
  icon: React.ReactNode;
  onClick?: () => void;
  count?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  link,
  icon,
  onClick = () => {},
  count = 0,
}) => {
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);

  return (
    <Button
      variant={selectedPage === link ? 'secondarySidebar' : 'sidebar'}
      // size="sidebar"
      onClick={() => {
        setSelectedPage(link as any);
        onClick();
      }}
      className="flex items-center space-x-2 justify-between"
    >
      <span className="flex items-center space-x-2">
        {icon}
        <span className="ml-1">{name}</span>
      </span>

      {count ? <span className="ml-2">{count}</span> : null}
    </Button>
  );
};
