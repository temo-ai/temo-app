import {useState, useRef} from 'react';
import PublishToGithub from './PublishToGithub';
import PublishToVercel from './PublishToVercel';
import {Modal, Button} from '../ui'; // Import the Modal component
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../ui/tabs';
import {Share} from 'lucide-react';

interface ShareModalProps {
  temoId: number;
}

const ShareModal = ({temoId}: ShareModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Share className="h-4 w-4" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalRef={modalRef}
        style={{
          width: '500px',
          height: '300px',
        }}
      >
        <Tabs
          defaultValue="vercel"
          className="w-full h-full"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="vercel">Vercel</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            {/* <TabsTrigger value="markdown">Markdown</TabsTrigger> */}
          </TabsList>
          <TabsContent value="vercel">
            <PublishToVercel temoId={temoId} />
          </TabsContent>
          <TabsContent value="github">
            <PublishToGithub temoId={temoId} />
          </TabsContent>
        </Tabs>
      </Modal>
    </>
  );
};

export default ShareModal;
