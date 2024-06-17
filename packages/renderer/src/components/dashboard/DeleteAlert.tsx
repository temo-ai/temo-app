import type React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {toast} from 'sonner';
import {isDeleteOpenAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {deleteTemo} from '#preload';

const DeleteModal: React.FC = () => {
  const [open, setOpen] = useAtom(isDeleteOpenAtom);

  const handleDelete = async () => {
    try {
      if (open?.temoId) {
        await deleteTemo(open?.temoId);
        toast.success('Temo deleted successfully');
      }
    } catch (error) {
      toast.error('Something went wrong');
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

  return (
    <AlertDialog
      open={open.open}
      onOpenChange={toggleOpen}
    >
      <AlertDialogContent className="border border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You can find the deleted temo in the recycle bin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-foreground"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
