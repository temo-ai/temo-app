import {useEffect} from 'react';
import {allFoldersAtom} from '../../utils/atoms';
import {useAtomValue, useAtom} from 'jotai';
import {
  fetchFolders,
  selectedFolderIdAtom,
  allTemosAtom,
  deleteFolder,
  selectedPageAtom,
} from '../../utils/atoms';
import {Button} from '../ui';
import {FiTrash2} from 'react-icons/fi';
import {toast} from 'sonner';

interface Folder {
  id: number;
  name: string;
}

export default function FolderList() {
  const folders = useAtomValue<Folder[]>(allFoldersAtom);
  const [selectedFolder, setSelectedFolder] = useAtom<number>(selectedFolderIdAtom);
  const [, setSelectedPage] = useAtom(selectedPageAtom);
  const temos = useAtomValue(allTemosAtom);

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleDeleteFolder = async (folderId: number) => {
    try {
      if (getTemoCount(folderId) > 0) {
        toast.error('Please move all Temos to another collection before deleting');
        return;
      }
      await deleteFolder(folderId);
      fetchFolders();
      toast.success('Collection deleted successfully');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getTemoCount = (folderId: number): number => {
    return Object.values(temos).filter(temo => temo.folderId === folderId).length;
  };

  const sortedFolders = folders?.slice().sort((a, b) => getTemoCount(b?.id) - getTemoCount(a?.id));

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[40vh]">
      {sortedFolders?.map(folder => (
        <Button
          key={folder.id}
          variant={selectedFolder === folder.id ? 'secondarySidebar' : 'sidebar'}
          className={'justify-between group'}
          onClick={() => {
            setSelectedFolder(folder.id);
            setSelectedPage('FOLDER');
          }}
        >
          <span>{folder.name}</span>
          <div className="flex items-center gap-2">
            <FiTrash2
              onClick={ev => {
                ev.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className="text-gray-500 hover:text-red-500 invisible group-hover:visible"
              size={18}
            />
            <span>{getTemoCount(folder.id)}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
