import type React from 'react';
import {useEffect, useState} from 'react';
import {Command} from 'cmdk';
import {
  isBrowserOpenAtom,
  isCommandMenuOpenAtom,
  selectedPageAtom,
  selectedTabIdAtom,
  isCreateFolderOpenAtom,
  allFoldersAtom,
  allTemosAtom,
  selectedFolderIdAtom,
  allTabsAtom,
  selectedSettingAtom,
} from '../../utils/atoms';

import type {allTemosType} from '../../utils/atoms';
import {useAtom, useSetAtom} from 'jotai';

const CommandMenu: React.FC = () => {
  const setIsBrowserOpen = useSetAtom(isBrowserOpenAtom);
  const [commandMenuOpen, setCommandMenuOpen] = useAtom(isCommandMenuOpenAtom);
  const setSelectedPage = useSetAtom(selectedPageAtom);
  const setAllTabs = useSetAtom(allTabsAtom);
  const setSelectedFolderId = useSetAtom(selectedFolderIdAtom);
  const [, setSelectedSetting] = useAtom(selectedSettingAtom);

  const setSelectedTabId = useSetAtom(selectedTabIdAtom);
  const [, setOpen] = useAtom(isCreateFolderOpenAtom);
  const [allFolders] = useAtom(allFoldersAtom);
  const [allTemos] = useAtom(allTemosAtom);
  const [usageCounts, setUsageCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen(commandMenuOpen => !commandMenuOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setCommandMenuOpen]);

  const handleSelect = (temo: any) => {
    setAllTabs(prev => {
      const isTemoAlreadyOpen = prev.some(tab => tab?.id === temo?.id);
      if (!isTemoAlreadyOpen) {
        return [
          ...prev,
          {
            id: temo?.id,
            name: temo?.title || temo?.name,
            folderId: temo?.folderId,
          },
        ];
      }
      return prev;
    });
    setSelectedTabId(temo?.id);
    incrementUsageCount(temo?.id);
  };

  const incrementUsageCount = (key: string) => {
    setUsageCounts(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const sortItemsByUsage = (items: any[], keyExtractor: (item: any) => string) => {
    return items.sort(
      (a, b) => (usageCounts[keyExtractor(b)] || 0) - (usageCounts[keyExtractor(a)] || 0),
    );
  };

  return (
    <Command.Dialog
      open={commandMenuOpen}
      onOpenChange={setCommandMenuOpen}
      label="Global Command Menu"
    >
      <Command.Input placeholder="Search for apps and commands..." />
      <Command.Separator alwaysRender={true} />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <ActionsGroup
          setSelectedPage={setSelectedPage}
          setSelectedTabId={setSelectedTabId}
          setIsBrowserOpen={setIsBrowserOpen}
          setCommandMenuOpen={setCommandMenuOpen}
          setOpen={setOpen}
          incrementUsageCount={incrementUsageCount}
          usageCounts={usageCounts}
          setSelectedSetting={setSelectedSetting}
        />

        <FoldersGroup
          allFolders={sortItemsByUsage(allFolders, folder => folder.id)}
          setSelectedPage={setSelectedPage}
          setSelectedFolderId={setSelectedFolderId}
          setSelectedTabId={setSelectedTabId}
          setCommandMenuOpen={setCommandMenuOpen}
          incrementUsageCount={incrementUsageCount}
        />
        <TemosGroup
          allTemos={sortItemsByUsage(Object.values(allTemos), temo => temo.id)}
          setSelectedPage={setSelectedPage}
          handleSelect={handleSelect}
          setCommandMenuOpen={setCommandMenuOpen}
        />
      </Command.List>
      <Command.Separator alwaysRender={true} />
      <Footer />
    </Command.Dialog>
  );
};

const ActionsGroup: React.FC<{
  setSelectedPage: (page: any) => void;
  setSelectedTabId: (id: number) => void;
  setIsBrowserOpen: (open: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  incrementUsageCount: (key: string) => void;
  usageCounts: {[key: string]: number};
  setSelectedSetting: (setting: 'LLM' | 'GITHUB' | 'VERCEL' | 'BRAND' | 'TRANSLATION') => void;
}> = ({
  setSelectedPage,
  setSelectedTabId,
  setIsBrowserOpen,
  setCommandMenuOpen,
  setOpen,
  incrementUsageCount,
  usageCounts,
  setSelectedSetting,
}) => {
  const actions = [
    {
      value: 'Open Browser',
      onSelect: () => {
        setSelectedPage('HOME');
        setSelectedTabId(0);
        setIsBrowserOpen(true);
        setCommandMenuOpen(false);
        incrementUsageCount('Browser');
      },
    },
    {
      value: 'Create Collection',
      onSelect: () => {
        setSelectedPage('HOME');
        setSelectedTabId(0);
        setCommandMenuOpen(false);
        setOpen(true);
        incrementUsageCount('Create Collection');
      },
    },
    {
      value: 'Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        incrementUsageCount('Settings');
      },
    },
    {
      value: 'LLM Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        setSelectedSetting('LLM');
        incrementUsageCount('LLM Settings');
      },
    },
    {
      value: 'GitHub Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        setSelectedSetting('GITHUB');
        incrementUsageCount('GitHub Settings');
      },
    },
    {
      value: 'Vercel Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        setSelectedSetting('VERCEL');
        incrementUsageCount('Vercel Settings');
      },
    },
    {
      value: 'Branding Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        setSelectedSetting('BRAND');
        incrementUsageCount('Branding Settings');
      },
    },
    {
      value: 'Translation Settings',
      onSelect: () => {
        setSelectedPage('SETTINGS');
        setCommandMenuOpen(false);
        setSelectedTabId(0);
        setSelectedSetting('TRANSLATION');
        incrementUsageCount('Translation Settings');
      },
    },
  ];

  const sortedActions = actions.sort(
    (a, b) => (usageCounts[b.value] || 0) - (usageCounts[a.value] || 0),
  );

  return (
    <Command.Group heading="Actions">
      {sortedActions.map(action => (
        <Command.Item
          key={action.value}
          value={action.value}
          onSelect={action.onSelect}
        >
          {action.value}
        </Command.Item>
      ))}
    </Command.Group>
  );
};

const FoldersGroup: React.FC<{
  allFolders: any[];
  setSelectedPage: (page: any) => void;
  setSelectedFolderId: (id: number) => void;
  setSelectedTabId: (id: number) => void;
  setCommandMenuOpen: (open: boolean) => void;
  incrementUsageCount: (key: string) => void;
}> = ({
  allFolders,
  setSelectedPage,
  setSelectedFolderId,
  setSelectedTabId,
  setCommandMenuOpen,
  incrementUsageCount,
}) => (
  <Command.Group heading="Folders">
    {allFolders.map(folder => (
      <Command.Item
        key={folder.id}
        value={folder.name + folder.id}
        onSelect={() => {
          setSelectedPage('FOLDER');
          setSelectedFolderId(folder.id);
          setSelectedTabId(0);
          setCommandMenuOpen(false);
          incrementUsageCount(folder.id);
        }}
      >
        {folder.name}
      </Command.Item>
    ))}
  </Command.Group>
);

const TemosGroup: React.FC<{
  allTemos: allTemosType;
  setSelectedPage: (page: any) => void;
  handleSelect: (temo: any) => void;
  setCommandMenuOpen: (open: boolean) => void;
}> = ({allTemos, setSelectedPage, handleSelect, setCommandMenuOpen}) => (
  <Command.Group heading="Temos">
    {Object.values(allTemos).map(temo => (
      <Command.Item
        key={temo.id}
        value={temo.name + temo.id}
        onSelect={() => {
          setSelectedPage('TEMO');
          handleSelect(temo);
          setCommandMenuOpen(false);
        }}
      >
        {temo?.title || temo.name}
      </Command.Item>
    ))}
  </Command.Group>
);

const Footer: React.FC = () => (
  <div className="flex justify-between items-center p-2 py-0 pt-1 text-xs text-gray-700 bottom-0">
    <div>logo</div>
    <div className="flex gap-x-3">
      <div className="py-1">
        Open Application{' '}
        <span className="bg-[#efecec] rounded px-1 py-[2px] text-[#706f6f]">↵</span>
      </div>
      <div className="py-2 mt-1 bg-gray-400 w-[1px] h-full"></div>
      <button className="pr-1 pl-2 text-[#706f6f] flex hover:bg-[#dcd9d9] rounded py-1">
        <span className="mr-2">Actions</span>
        <span className="bg-[#efecec] rounded px-1 mr-1">⌘</span>
        <span className="bg-[#efecec] rounded px-1">k</span>
      </button>
    </div>
  </div>
);

export default CommandMenu;
