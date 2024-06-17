import {Button} from '../ui';
import {toast} from 'sonner';
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from '../ui/card';
import {configAtom, selectedTemoAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {fetchTemo} from '../../utils/atoms';
import {
  publishToVercel as publishToVercelPreload,
  unPublishFromVercel as unPublishFromVercelPreload,
} from '#preload';

const PublishToVercel = ({temoId}: {temoId: number}) => {
  const [config] = useAtom(configAtom);
  const [selectedTemo] = useAtom(selectedTemoAtom);

  const publishToVercel = async () => {
    if (!config?.blobToken) {
      toast.error('Vercel Blob token not found, please set it in the settings');
      return;
    }
    const publishPromise = publishToVercelPreload({
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
  const unPublishFromVercel = async () => {
    const unpublishPromise = unPublishFromVercelPreload({
      temoId,
    });
    toast.promise(unpublishPromise, {
      loading: 'Unpublishing from Vercel...',
      success: 'Temo unpublished from Vercel successfully!',
      error: 'Error unpublishing from Vercel',
    });

    try {
      await unpublishPromise;
      fetchTemo(temoId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish to Vercel</CardTitle>
        <CardDescription>Publish your temo to Vercel.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2"></CardContent>
      <CardFooter className="flex flex-row gap-2 justify-between">
        <Button onClick={publishToVercel}>
          {selectedTemo?.isPublished ? 'Update' : 'Publish'}
        </Button>
        {selectedTemo?.isPublished ? (
          <Button
            onClick={unPublishFromVercel}
            variant="ghost"
          >
            Unpublish
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default PublishToVercel;
