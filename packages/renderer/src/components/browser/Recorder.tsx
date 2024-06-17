import {useEffect, useRef, useState} from 'react';
import RecorderContent from './RecorderContent';
import RecorderTabs from './RecorderTabs';
import {Modal} from '../ui/recorderModal';
import {useHotkeys} from 'react-hotkeys-hook';
import {Button} from '../ui/button';
import {useAtom} from 'jotai';
import {isBrowserOpenAtom} from '../../utils/atoms';
import {PlusIcon, XIcon} from 'lucide-react';
import {
  onUpdateModalSize as onUpdateModalSizePreload,
  closeRecorder as closeRecorderPreload,
  onUpdateTitle as onUpdateTitlePreload,
} from '#preload';

const Recorder = () => {
  const [isOpen, setIsOpen] = useAtom(isBrowserOpenAtom);
  const [tabs, setTabs] = useState({
    id: 1,
    title: 'New tab',
    url: '',
  });
  const [modalSize, setModalSize] = useState({width: 1000, height: 1000});

  const [activeTab, setActiveTab] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const setUrl = (newUrl: string) => {
    setTabs(prevTabs => ({
      ...prevTabs,
      url: newUrl,
    }));
  };
  const updateTitle = (title: string) => {
    setTabs(prevTabs => ({
      ...prevTabs,
      title: title,
    }));
  };

  useEffect(() => {
    onUpdateTitlePreload(updateTitle);
    updateModalSize();
  }, [isOpen]);

  async function updateModalSize() {
    const {width, height} = await onUpdateModalSizePreload();
    if (!width || !height) {
      return;
    }
    setModalSize({
      width,
      height,
    });
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    closeRecorderPreload();
  };

  useHotkeys('Esc', closeModal, {enabled: isOpen});

  return (
    <>
      <Button
        onClick={openModal}
        className="flex items-center"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        New Temo
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        modalRef={modalRef}
        style={{
          width: modalSize.width + 16,
          backgroundColor: 'transparent',
        }}
      >
        <div className="w-full rounded-md bg-gradient-to-b from-[rgba(132,169,140,0.68)] via-[rgba(82,121,111,0.08)] to-white p-2">
          <div className="w-full h-[100px] sticky">
            <nav className="flex h-[40px] w-full flex-nowrap  pt-1 items-center justify-between">
              <div className="flex gap-1 h-full">
                <RecorderTabs
                  key={tabs.id}
                  tab={tabs}
                  activeTab={activeTab}
                  onTabClick={setActiveTab}
                />
              </div>
              {/* Close */}
              <Button
                variant="ghost"
                className="h-full"
                onClick={closeModal}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </nav>

            <RecorderContent
              url={tabs?.url}
              setUrl={setUrl}
            />
          </div>
          <div className="w-full aspect-video overflow-auto"></div>
        </div>
      </Modal>
    </>
  );
};

export default Recorder;
