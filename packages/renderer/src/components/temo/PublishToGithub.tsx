import {Button} from '../ui';
import {toast} from 'sonner';
import {Card, CardContent, CardDescription, CardHeader} from '../ui/card';
import {configAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {publishToGithub as publishToGitHubPreload} from '#preload';

const PublishToGithub = ({temoId}: {temoId: number}) => {
  const [config] = useAtom(configAtom);

  const publishToGitHub = async () => {
    if (!config.authToken) {
      toast.error('GitHub auth token not found, please set it in the settings');
      return;
    }

    const publishPromise = publishToGitHubPreload({
      temoId,
    });

    toast.promise(publishPromise, {
      loading: 'Publishing to GitHub...',
      success: 'Temo published to GitHub successfully!',
      error: 'Error publishing to GitHub',
    });

    try {
      await publishPromise;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>Publish your temo to Github.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={publishToGitHub}>Publish</Button>
      </CardContent>
    </Card>
  );
};

export default PublishToGithub;
