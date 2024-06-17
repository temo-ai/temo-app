import {Trash, MoreVertical} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Button} from '../ui/button';
import {isRenameTemoOpenAtom, isMoveToFolderOpenAtom, isDeleteOpenAtom} from '../../utils/atoms';
import {useSetAtom} from 'jotai';

import {FolderPen} from 'lucide-react';
interface DropThreeDotsProps {
  temo: any;
}

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, label, onClick}) => (
  <DropdownMenuItem
    onClick={onClick}
    className="flex items-center gap-4"
  >
    {icon}
    {label}
  </DropdownMenuItem>
);

const DropThreeDots: React.FC<DropThreeDotsProps> = ({temo}) => {
  const setRenameOpen = useSetAtom(isRenameTemoOpenAtom);
  const setMoveToFolderOpen = useSetAtom(isMoveToFolderOpenAtom);
  const setDeleteOpen = useSetAtom(isDeleteOpenAtom);

  const params = {
    open: true,
    temoName: temo?.name,
    temoTitle: temo?.title,
    temoId: temo?.id,
    folderId: temo?.folderId,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="smIcon"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border border-border"
        onClick={ev => {
          ev.stopPropagation();
        }}
      >
        <MenuItem
          icon={<FolderPen size={18} />}
          label="Rename"
          onClick={() => setRenameOpen(params)}
        />
        <MenuItem
          icon={<FolderPen size={18} />}
          label="Move to Collection"
          onClick={() => setMoveToFolderOpen(params)}
        />
        <MenuItem
          icon={<Trash size={18} />}
          label="Delete"
          onClick={() => setDeleteOpen(params)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropThreeDots;
