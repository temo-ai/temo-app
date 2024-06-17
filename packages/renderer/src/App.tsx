import {useEffect} from 'react';
import {useAtom, useSetAtom, useAtomValue} from 'jotai';
import Sidebar from './components/dashboard/Sidebars';
import TemoDetails from './components/temo/TemoDetails';
import Tabs from './components/helper/Tabs';
import {useHotkeys} from 'react-hotkeys-hook';
import FolderSection from './components/folders/FolderSection';
import CommandMenu from './components/dashboard/CommandPallete';
import Settings from './components/settings';
import RenameModal from './components/dashboard/RenameModal';
import MoveToFolderModal from './components/folders/MoveToFolderModal';
import DeleteAlert from './components/dashboard/DeleteAlert';
import {
  selectedTabIdAtom,
  allTabsAtom,
  selectedPageAtom,
  fetchUserDataPath,
  fetchTemos,
  fetchConfig,
} from './utils/atoms';

import {Toaster} from 'sonner';

import {TooltipProvider} from './components/ui/tooltip';
import {ThemeProvider} from './components/helper/theme-provider';
import CardGrid from './components/dashboard/CardGrid';

export default function App() {
  const [selectedTabId, setSelectedTabId] = useAtom(selectedTabIdAtom);
  const setAllTabs = useSetAtom(allTabsAtom);
  const selectedPage = useAtomValue(selectedPageAtom);
  console.log('selectedPage', selectedPage);
  useEffect(() => {
    fetchConfig();
    fetchTemos();
    fetchUserDataPath();
  }, []);

  useHotkeys(
    'ctrl+w',
    () => {
      setAllTabs(prev => prev.filter(tab => tab.id !== selectedTabId));
      setSelectedTabId(0);
    },
    {enabled: selectedTabId !== null},
  );
  useHotkeys('ctrl+k', () => {
    console.log('CommK is pressed');
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster
        position="bottom-right"
        richColors
      />
      <TooltipProvider>
        <RenameModal />
        <MoveToFolderModal />
        <CommandMenu />
        <DeleteAlert />
        <div className="w-screen h-full bg-gradient-to-b from-[rgba(132,169,140,0.68)] via-[rgba(82,121,111,0.08)] to-white flex flex-col p-2">
          <Tabs />
          <main className="flex flex-1 bg-background rounded-lg shadow-lg overflow-hidden z-0">
            {selectedTabId ? (
              <TemoDetails id={selectedTabId} />
            ) : (
              <>
                <Sidebar />
                <div className="flex flex-1 flex-col bg-muted/40">
                  {selectedPage === 'HOME' && <CardGrid />}
                  {selectedPage === 'RECENT' && <CardGrid recent={true} />}
                  {selectedPage === 'FOLDER' && <FolderSection />}
                  {selectedPage === 'SETTINGS' && <Settings />}
                </div>
              </>
            )}
          </main>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
