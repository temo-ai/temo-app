import {Button} from '../ui';
import {toast} from 'sonner';
import {Card, CardContent, CardDescription, CardHeader} from '../ui/card';
import {configAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {fetchTemo} from '../../utils/atoms';

const PublishToMarkdown = ({temoId}: {temoId: number}) => {
  const [config] = useAtom(configAtom);

  const publishToMarkdown = async () => {
    if (!config?.blobToken) {
      toast.error('Vercel Blob token not found, please set it in the settings');
      return;
    }
    const publishPromise = publishToMarkdown({
      temoId,
    });
    toast.promise(publishPromise, {
      loading: 'Publishing to Vercel...',
      success: 'Temo published to Vercel successfully!',
      error: 'Error publishing to Vercel',
    });
    try {
      await publishPromise;
      fetchTemo(temoId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>Publish your temo to Markdown.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button onClick={publishToMarkdown}>Publish</Button>
      </CardContent>
    </Card>
  );
};

export default PublishToMarkdown;
