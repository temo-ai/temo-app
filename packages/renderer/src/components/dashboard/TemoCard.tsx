import type React from 'react';
import DropThreeDots from './DropThreeDots';
import {useSetAtom, useAtomValue} from 'jotai';
import {selectedTabIdAtom, allTabsAtom, userDataPathAtom} from '../../utils/atoms';
import type {Temo} from '../../utils/atoms';

export interface CardProps {
  temo: Temo;
  sortOrder: 'updatedAt' | 'createdAt' | 'title';
}
const TemoCard: React.FC<CardProps> = ({temo, sortOrder}) => {
  const setSelectedTabId = useSetAtom(selectedTabIdAtom);
  const setAllTabs = useSetAtom(allTabsAtom);
  const userDataPath = useAtomValue(userDataPathAtom);

  const handleSelect = () => {
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
  };

  const thumbnail = `media://${userDataPath}/temos/${temo.sessionId}/thumbnails/${temo.sessionId}-sm.png`;

  return (
    <div
      className="flex flex-col cursor-pointer group"
      onClick={handleSelect}
    >
      <TemoThumbnail
        thumbnail={thumbnail}
        temo={temo}
      />
      <TemoDetails
        temo={temo}
        sortOrder={sortOrder}
      />
    </div>
  );
};

const TemoThumbnail: React.FC<{thumbnail: string; temo: any}> = ({thumbnail, temo}) => (
  <div className="aspect-video bg-background rounded-lg overflow-hidden border">
    <img
      src={thumbnail}
      className="w-full h-full object-cover"
      alt={temo?.title || temo?.name}
    />
  </div>
);

const TemoDetails: React.FC<{
  temo: any;
  sortOrder: 'updatedAt' | 'createdAt' | 'title';
}> = ({temo, sortOrder}) => (
  <div className="py-2 text-sm font-semibold group">
    <div className="flex items-center justify-between">
      <span className="w-full truncate">{temo?.title || temo?.name}</span>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <DropThreeDots temo={temo} />
      </div>
    </div>

    <div className="flex justify-between w-full">
      {/* {temo[sortOrder]} */}
      {sortOrder !== 'title' && (
        <TemoDate
          temo={temo}
          sortOrder={sortOrder}
        />
      )}
      {temo?.isPublished ? (
        <span className="text-green-700/50">Published</span>
      ) : (
        <span className="text-primary/50">Draft</span>
      )}
    </div>
  </div>
);

const TemoDate: React.FC<{
  temo: any;
  sortOrder: 'updatedAt' | 'createdAt' | 'title';
}> = ({temo, sortOrder}) => (
  <span className="text-foreground/50">
    {sortOrder === 'updatedAt' ? 'Updated ' : 'Created '}
    {temo[sortOrder] ? dateParser(temo[sortOrder]) : ''}
  </span>
);

function dateParser(date: string): string {
  const parsedDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 172800) {
    return 'Yesterday';
  } else {
    return parsedDate.toLocaleString('en-GB', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
}
export default TemoCard;
