import {useEffect, useState} from 'react';
import {Button} from '../ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Input} from '../ui/input';
import {Label} from '../ui/label';
import {toast} from 'sonner';

import {LucideEye, LucideEyeOff} from 'lucide-react';
import {Toggle} from '../ui/toggle';
import {useAtom} from 'jotai';
import {configAtom} from '../../utils/atoms';
import {saveConfig as saveConfigPreload, openLink as openLinkPreload} from '#preload';

export const GithubSettings = () => {
  const [disabled, setDisabled] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [config] = useAtom(configAtom);

  const [githubConfig, setGitHubConfig] = useState({
    authToken: '',
    repo: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGitHubConfig({
      authToken: config?.authToken,
      repo: config?.repo,
    });
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(false);
    setGitHubConfig(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const saveConfig = async () => {
    try {
      if (!githubConfig.authToken || !githubConfig.repo) {
        toast.info('Please enter a GitHub auth token and repository URL');
        return;
      }
      await saveConfigPreload({
        ...config,
        ...githubConfig,
      });
      setDisabled(true);
      toast.success('GitHub config saved successfully!');
    } catch (error) {
      console.error(error);
      setError('Error saving GitHub config');
      toast.error('Error saving GitHub config');
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub</CardTitle>
        <CardDescription>Configure your GitHub settings for publishing guides.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repo">Repository URL</Label>
          <Input
            id="repo"
            name="repo"
            placeholder="Enter GitHub Repository URL"
            value={githubConfig.repo}
            onChange={handleInputChange}
            type="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="authToken">Auth Token</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="authToken"
              name="authToken"
              placeholder="Enter GitHub Auth Token"
              type="password"
              value={githubConfig.authToken}
              onChange={handleInputChange}
            />
            <Toggle
              pressed={showKey}
              defaultPressed={false}
              onPressedChange={() => setShowKey(!showKey)}
              className="flex items-center space-x-2"
            >
              {showKey ? <LucideEye className="w-4 h-4" /> : <LucideEyeOff className="w-4 h-4" />}
            </Toggle>
            <Button
              variant="outline"
              onClick={() => openLinkPreload('https://github.com/settings/tokens?type=beta')}
            >
              Get Token
            </Button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Button
            onClick={saveConfig}
            disabled={disabled}
          >
            Save
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
