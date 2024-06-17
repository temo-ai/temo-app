import {useEffect} from 'react';
import {useAtomValue, useAtom} from 'jotai';
import {
  allTemosAtom,
  fetchTemos,
  selectedFolderIdAtom,
  publishedAtom,
  sortOrderAtom,
  selectedFolderAtom,
} from '../../utils/atoms';
import TemoCard from './TemoCard';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import {Edit3, SortDescIcon, Clock, LucideText} from 'lucide-react';
import {Button} from '../ui/button';
import {onTemoChanged} from '#preload';

// Main component
const CardGrid = ({recent = false}) => {
  const temos = useAtomValue(allTemosAtom);
  const selectedFolderId = useAtomValue(selectedFolderIdAtom);
  const [published, setPublished] = useAtom(publishedAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);

  useEffect(() => {
    onTemoChanged(() => {
      fetchTemos(); // Reload temos when a temo is created or deleted
    });
  }, []);

  const handleSortChange = (value: 'updatedAt' | 'createdAt' | 'title') => {
    setSortOrder(value);
  };

  const getFilteredTemos = () => {
    const temosArray = Object.values(temos);
    const publishedTemos =
      published === 2 ? temosArray : temosArray.filter(temo => temo.isPublished === published);
    return selectedFolderId
      ? publishedTemos.filter(temo => temo.folderId === selectedFolderId)
      : publishedTemos;
  };

  const getSortedTemos = temosArray => {
    return temosArray.sort((a, b) => {
      if (sortOrder === 'updatedAt' || sortOrder === 'createdAt') {
        return new Date(b[sortOrder]).getTime() - new Date(a[sortOrder]).getTime();
      } else {
        return a?.title?.localeCompare(b?.title);
      }
    });
  };

  const filteredTemos = getFilteredTemos();
  const sortedTemos = getSortedTemos(filteredTemos);

  return (
    <div
      className="flex flex-1 flex-col space-y-4 overflow-y-auto"
      key={selectedFolderId}
    >
      <div className="p-4 md:p-10 lg:p-20 mx-auto w-full">
        <div className="flex justify-between w-full">
          <Header recent={recent} />
          {!recent && (
            <SortFilterControls
              published={published}
              setPublished={setPublished}
              sortOrder={sortOrder}
              handleSortChange={handleSortChange}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 justify-between gap-8">
          {recent
            ? sortedTemos?.map(temo => (
                <TemoCard
                  key={temo.id}
                  temo={temo}
                  sortOrder={sortOrder}
                />
              ))
            : sortedTemos?.map(temo => (
                <TemoCard
                  key={temo.id}
                  temo={temo}
                  sortOrder={sortOrder}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrid;

const Header = ({recent}: {recent: boolean}) => {
  const [selectedFolder] = useAtom(selectedFolderAtom);

  return (
    <h1 className="text-xl font-semibold text-foreground sm:text-3xl w-full">
      {selectedFolder ? `${selectedFolder?.name}` : recent ? 'Recent' : 'All Temos'}
    </h1>
  );
};

const label = {
  updatedAt: 'Updated',
  createdAt: 'Created',
  title: 'Title',
};

const SortFilterControls = ({
  published,
  setPublished,
  sortOrder,
  handleSortChange,
}: {
  published: 0 | 1 | 2;
  setPublished: (value: 0 | 1 | 2) => void;
  sortOrder: 'updatedAt' | 'createdAt' | 'title';
  handleSortChange: (value: 'updatedAt' | 'createdAt' | 'title') => void;
}) => {
  return (
    <div className="w-full flex justify-end mb-4 space-x-2">
      <PublishFilterControls
        published={published}
        setPublished={setPublished}
      />
      <SortOrderDropdown
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
      />
    </div>
  );
};

const PublishFilterControls = ({
  published,
  setPublished,
}: {
  published: 0 | 1 | 2;
  setPublished: (value: 0 | 1 | 2) => void;
}) => {
  return (
    <div>
      <Button
        onClick={() => setPublished(2)}
        variant={published !== 2 ? 'secondary' : 'default'}
        className="rounded-r-none"
      >
        All
      </Button>
      <Button
        onClick={() => setPublished(1)}
        variant={published !== 1 ? 'secondary' : 'default'}
        className="rounded-none"
      >
        Published
      </Button>
      <Button
        onClick={() => setPublished(0)}
        variant={published !== 0 ? 'secondary' : 'default'}
        className="rounded-l-none"
      >
        Draft
      </Button>
    </div>
  );
};

const SortOrderDropdown = ({
  sortOrder,
  handleSortChange,
}: {
  sortOrder: 'updatedAt' | 'createdAt' | 'title';
  handleSortChange: (value: 'updatedAt' | 'createdAt' | 'title') => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <SortDescIcon className="mr-2 w-4 h-4" />
        {label[sortOrder]}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => handleSortChange('updatedAt')}
          className={sortOrder === 'updatedAt' ? 'text-primary' : ''}
        >
          <Edit3 className="mr-2 w-4 h-4" />
          Updated
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange('createdAt')}
          className={sortOrder === 'createdAt' ? 'text-primary' : ''}
        >
          <Clock className="mr-2 w-4 h-4" />
          Created
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => handleSortChange('title')}
          className={sortOrder === 'title' ? 'text-primary' : ''}
        >
          <LucideText className="mr-2 w-4 h-4" />
          Title
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
