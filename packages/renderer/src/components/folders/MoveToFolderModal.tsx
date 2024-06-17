import type React from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog';
import {useAtom} from 'jotai';
import {isMoveToFolderOpenAtom, allFoldersAtom, fetchTemos} from '../../utils/atoms';
import {useAtomValue} from 'jotai';
import {toast} from 'sonner';
import {updateTemoFolder, removeFromFolder} from '#preload';

import {ToggleGroup, ToggleGroupItem} from '../ui/toggle-group';

const MoveToFolderModal: React.FC = () => {
  const folders = useAtomValue(allFoldersAtom);
  const [isOpen, setIsOpen] = useAtom(isMoveToFolderOpenAtom);

  const handleUpdatingTemo = async (temoId: number, folderId: string) => {
    try {
      if (folderId) {
        await updateTemoFolder(temoId, Number(folderId));
      } else {
        await removeFromFolder(temoId);
      }
      toast.success('Temo moved to collection');
      setIsOpen({
        open: false,
        temoName: '',
        temoId: 0,
        folderId: 0,
        temoTitle: '',
      });
      fetchTemos();
    } catch (error) {
      toast.error('Failed to move to collection');
    }
  };

  const toggleOpen = () => {
    setIsOpen({
      open: !isOpen.open,
      temoName: isOpen.temoName,
      temoId: isOpen.temoId,
      folderId: isOpen.folderId,
      temoTitle: isOpen.temoTitle,
    });
  };

  return (
    <>
      <Dialog
        open={isOpen?.open}
        onOpenChange={toggleOpen}
      >
        <DialogContent className="border border-border">
          <DialogHeader>
            <DialogTitle>Move to Collection</DialogTitle>
          </DialogHeader>
          <div className="flex w-full flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a collection to move the temo{' '}
              <span className="text-sm font-semibold">{isOpen.temoName}</span> to
            </p>

            <ToggleGroup
              type="single"
              value={isOpen?.folderId?.toString()}
              onValueChange={value => {
                handleUpdatingTemo(isOpen?.temoId, value);
              }}
              className="flex-col w-full"
            >
              {' '}
              <ToggleGroupItem
                className="w-full justify-start"
                key="none"
                value=""
              >
                None
              </ToggleGroupItem>
              {folders
                ?.sort(
                  (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime(),
                )
                .map(folder => (
                  <ToggleGroupItem
                    className="w-full justify-start"
                    key={folder?.id}
                    value={folder?.id.toString()}
                  >
                    {folder?.name}
                  </ToggleGroupItem>
                ))}
            </ToggleGroup>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoveToFolderModal;
