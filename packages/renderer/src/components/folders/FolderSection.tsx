import {useEffect} from 'react';
import CardGrid from '../dashboard/CardGrid';
import {useAtom, useAtomValue} from 'jotai';
import {folderTemosAtom, selectedFolderAtom} from '../../utils/atoms';
import {fetchTemoFolder} from '#preload';

const FolderSection = () => {
  const [folderTemos, setFolderTemos] = useAtom(folderTemosAtom);
  const selectedFolder = useAtomValue(selectedFolderAtom);

  useEffect(() => {
    const fetchFolderTemo = async () => {
      try {
        const FolderTemos = await fetchTemoFolder(selectedFolder.id);
        setFolderTemos(FolderTemos);
      } catch (error) {
        console.log('Failed to fetch', error);
      }
    };
    fetchFolderTemo();
  }, [selectedFolder, setFolderTemos]);

  return <CardGrid />;
};

export default FolderSection;
