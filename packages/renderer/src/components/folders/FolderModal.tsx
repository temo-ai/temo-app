import {useState} from 'react';
import type {FormEvent, ChangeEvent, KeyboardEvent} from 'react';
import {Button, Input} from '../ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import {toast} from 'sonner';

import {FolderPlus} from 'lucide-react';
import {fetchFolders} from '../../utils/atoms';
import {isCreateFolderOpenAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {createFolder} from '#preload';

export default function FolderModal() {
  const [folderName, setFolderName] = useState<string>('');
  const [open, setOpen] = useAtom(isCreateFolderOpenAtom);

  const handleCreateFolder = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedFolderName = folderName.trim();
    if (trimmedFolderName) {
      const res = await createFolder(trimmedFolderName);
      if (res.success) {
        toast.success('Collection created');
        setOpen(false);
        fetchFolders();
      } else {
        toast.error(res.message);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateFolder(e as unknown as FormEvent);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <FolderPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-border">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>Enter a name for your new collection.</DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          value={folderName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="px-3 py-2 w-full mb-4 text-sm bg-input"
          placeholder="Enter new name"
        />
        <div className="flex justify-end">
          <Button onClick={handleCreateFolder}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
