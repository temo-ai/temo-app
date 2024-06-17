import {Button} from '../ui/button';
import ShareModal from './ShareTemo';

const TitleInfo = ({
  temoTitle,
  temoName,
  isPublished,
}: {
  temoTitle: string;
  temoName: string;
  isPublished: 0 | 1;
}) => (
  <div className="flex flex-col">
    <span className="text-sm truncate">{temoTitle || temoName}</span>
    <span className="text-xs truncate text-primary">{isPublished ? 'Published' : 'Draft'}</span>
  </div>
);

const TabButton = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <Button
    className="px-4 py-2"
    variant={!active ? 'ghost' : 'default'}
    onClick={onClick}
  >
    {label}
  </Button>
);

const Topbar = ({
  temoName,
  temoTitle,
  temoId,
  isPublished,
  activeTab,
  setActiveTab,
}: {
  temoName: string;
  temoTitle: string;
  temoId: number;
  isPublished: 0 | 1;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}) => {
  return (
    <div className="flex justify-between py-2 px-3">
      <div className="flex w-[30%]">
        <TitleInfo
          temoTitle={temoTitle}
          temoName={temoName}
          isPublished={isPublished}
        />
      </div>
      <div className="flex space-x-4 w-[30%] justify-center">
        <TabButton
          active={activeTab === 'article'}
          onClick={() => setActiveTab('article')}
          label="Article"
        />
        <TabButton
          active={activeTab === 'player'}
          onClick={() => setActiveTab('player')}
          label="Player"
        />
        <TabButton
          active={activeTab === 'video'}
          onClick={() => setActiveTab('video')}
          label="Video"
        />
      </div>
      <div className="flex w-[30%] justify-end">
        <ShareModal temoId={temoId} />
      </div>
    </div>
  );
};

export default Topbar;
