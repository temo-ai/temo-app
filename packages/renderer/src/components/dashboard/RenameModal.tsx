import type React from 'react';

import {useEffect, useState} from 'react';
import {Button, Input} from '../ui';
import type {FormEvent, KeyboardEvent} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '../ui/dialog';
import {isRenameTemoOpenAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {updateTemo} from '#preload';
import {toast} from 'sonner';

const RenameModal: React.FC = () => {
  const [open, setOpen] = useAtom(isRenameTemoOpenAtom);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setNewName(open.temoTitle || open.temoName || '');
  }, [open]);

  const handleRename = async (event: FormEvent) => {
    try {
      const trimmedNewName = newName.trim();
      if (trimmedNewName !== '') {
        await updateTemo(open.temoId, trimmedNewName);
        toast.success('Temo renamed');
        setOpen({open: false, temoName: '', temoId: 0, temoTitle: ''});
      }
    } catch (error) {
      toast.error('Failed to rename temo');
    }
  };

  const toggleOpen = () => {
    setOpen({
      open: !open.open,
      temoName: open.temoName,
      temoId: open.temoId,
      temoTitle: open.temoTitle,
    });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename(e as unknown as FormEvent);
    }
  };

  return (
    <Dialog
      open={open.open}
      onOpenChange={toggleOpen}
    >
      <DialogContent className="border border-border">
        <DialogHeader>
          <DialogTitle>Rename Temo</DialogTitle>
          <DialogDescription>Enter a new name for the temo.</DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          value={newName}
          onChange={e => {
            setNewName(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          className="px-3 py-2 w-full mb-4 text-sm bg-input"
          placeholder="Enter new name"
        />
        <div className="flex justify-end">
          <Button onClick={handleRename}>Rename</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
