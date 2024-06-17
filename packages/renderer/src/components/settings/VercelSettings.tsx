import {useState} from 'react';
import {Button} from '../ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {toast} from 'sonner';
import {configAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {LucideEye, LucideEyeOff} from 'lucide-react';
import {Toggle} from '../ui/toggle';
import {
  fetchVercelHostName as fetchVercelHostNamePreload,
  saveConfig as saveConfigPreload,
  openLink as openLinkPreload,
} from '#preload';

export const VercelSettings = () => {
  const [showKey, setShowKey] = useState(false);

  const [config, setConfig] = useAtom(configAtom);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const saveConfig = async () => {
    const myPromise = (async () => {
      console.log(config);
      if (!config.blobToken) {
        throw new Error('Please enter a Vercel Blob token');
      }
      const hostname = await fetchVercelHostNamePreload(config?.blobToken);
      console.log('Hostname:', hostname);
      setConfig(prev => ({...prev, hostname}));
      await saveConfigPreload({
        ...config,
        hostname,
      });

      return 'Vercel config saved successfully!';
    })();

    toast.promise(myPromise, {
      success: (message: string) => message,
      loading: 'Fetching Vercel Blob Hostname...',
      error: (error: Error) => {
        console.error(error);
        setError(error.message);
        return error.message;
      },
    });

    try {
      await myPromise;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vercel</CardTitle>
        <CardDescription>
          To get a Blob token, Navigate to your Vercel Dashboard and to the Storage tab.
          <br />
          Under the Create Database, select Blob and then the Continue button. Use the name
          &quot;temos&quot; and select Create a new Blob store. and paste the token in the input
          below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="authToken">Vercel Blob Token</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="blobToken"
              name="blobToken"
              placeholder="Enter Vercel Blob Token"
              type={showKey ? 'text' : 'password'}
              value={config?.blobToken}
              onChange={handleInputChange}
            />
            <Toggle
              pressed={showKey}
              defaultPressed={false}
              onPressedChange={() => setShowKey(!showKey)}
            >
              {showKey ? <LucideEye className="w-4 h-4" /> : <LucideEyeOff className="w-4 h-4" />}
            </Toggle>
            <Button
              variant="outline"
              onClick={() => {
                openLinkPreload('https://vercel.com/docs/storage/vercel-blob/using-blob-sdk');
              }}
            >
              Get Token
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={saveConfig}
            variant={config?.blobToken ? 'default' : 'outline'}
          >
            Save
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hostname">
            Vercel Hostname (Set this in Vercel Environment Variables for NEXT_PUBLIC_VERCEL_URL)
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="hostname"
              name="hostname"
              placeholder="Vercel Hostname"
              type="text"
              value={config?.hostname}
              readOnly
              onChange={handleInputChange}
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(config?.hostname);
                toast.success('Copied to clipboard');
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={config?.hostname ? 'default' : 'outline'}
          onClick={() => {
            openLinkPreload(DEPLOY_URL);
          }}
        >
          Deploy UI to Vercel
        </Button>
      </CardFooter>
    </Card>
  );
};

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftemo-ai%2Ftemo-publish&env=BLOB_READ_WRITE_TOKEN,NEXT_PUBLIC_VERCEL_URL&envDescription=Create%20Blob%20Token%20from%20here&envLink=https%3A%2F%2Fvercel.com%2Fdocs%2Fstorage%2Fvercel-blob%2Fclient-upload&project-name=temo-docs&repository-name=temo-docs&demo-title=Temo%20Docs&demo-description=A%20Documentation%20Template%20for%20Temo&demo-url=https%3A%2F%2Ftemo-vercel.vercel.app%2F&demo-image=https%3A%2F%2Ftemo-marketing.vercel.app%2F_next%2Fimage%3Furl%3D%252F_next%252Fstatic%252Fmedia%252Fbanner-dark.6bb249ad.png';
