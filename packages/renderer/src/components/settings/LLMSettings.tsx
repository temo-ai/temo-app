import {useState} from 'react';
import {Link, LucideEye, LucideEyeOff, Trash} from 'lucide-react';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Label} from '../ui/label';
import {toast} from 'sonner';
import type {Config} from '../../utils/atoms';
import {ToggleGroup, ToggleGroupItem} from '../ui/toggle-group';
import {Toggle} from '../ui/toggle';
import {useAtom} from 'jotai';
import {configAtom} from '../../utils/atoms';
import {
  saveConfig as saveConfigPreload,
  openLink as openLinkPreload,
  testLLMConnection as testLLMConnectionPreload,
} from '#preload';

export function LLMSettings() {
  const [disabled, setDisabled] = useState(true);
  const [config, setConfig] = useAtom(configAtom);

  const validateConfig = (config: Config): boolean => {
    if (!config?.provider || !config?.model) {
      toast.info('Please select an LLM');
      return false;
    }
    // if (config?.provider === "OPENAI" && !config?.openaiApiKey) {
    //   toast.info("Please enter an OpenAI API key");
    //   return false;
    // }
    // if (config?.provider === "ANTHROPIC" && !config?.anthropicApiKey) {
    //   toast.info("Please enter an Anthropic API key");
    //   return false;
    // }
    // if (config?.provider === "GOOGLE" && !config?.googleApiKey) {
    //   toast.info("Please enter a Google API key");
    //   return false;
    // }
    return true;
  };

  const handleLLMChange = async (config: Config) => {
    try {
      if (!validateConfig(config)) return;

      await saveConfigPreload(config);
      setDisabled(true);
      toast.success('LLM settings changed');
    } catch (error) {
      toast.error('Failed to change LLM settings');
    }
  };

  const handleTestLLMConnection = async () => {
    const provider = config?.provider.toLowerCase();
    const accessor = `${provider}ApiKey`;
    const myPromise = testLLMConnectionPreload({
      provider: config?.provider,
      model: config?.model,
      [accessor]: config?.[accessor as keyof Config],
    });
    toast.promise(myPromise, {
      success: data => {
        console.log(data);
        return `${config?.provider} - ${config?.model} connection successful`;
      },
      loading: `Testing ${config?.provider} - ${config?.model} connection`,
      error: error => {
        console.error(error);
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select LLM</CardTitle>
          <CardDescription>
            Select the LLM you would like to use for your content. (We recommend OpenAI - GPT-4O or
            Gemini-1.5-Flash-Latest for best results)
            <br />
            Only Multimodal models are supported at this time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={config?.provider}
              onValueChange={value => {
                setDisabled(false);
                setConfig({
                  ...config,
                  provider: value,
                  model: MODELS?.[value]?.[0], // Reset model when provider changes
                });
              }}
            >
              {['OPENAI', 'GOOGLE', 'ANTHROPIC'].map(provider => (
                <ToggleGroupItem
                  key={provider}
                  value={provider}
                >
                  {provider}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <ToggleGroup
              type="single"
              className="justify-start"
              value={config?.model}
              onValueChange={value => {
                setDisabled(false);
                setConfig({
                  ...config,
                  model: value,
                });
              }}
            >
              {MODELS?.[config?.provider]?.map(model => (
                <ToggleGroupItem
                  key={model}
                  value={model}
                >
                  {model}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Button
            onClick={() => handleLLMChange(config)}
            disabled={!config?.provider || !config?.model || disabled}
          >
            Save
          </Button>
          <Button
            onClick={handleTestLLMConnection}
            variant="outline"
          >
            Test LLM Connection
          </Button>
        </CardFooter>
      </Card>
      <LLMSecrets
        config={config}
        setConfig={setConfig}
        disabled={disabled}
        setDisabled={setDisabled}
        handleTestLLMConnection={handleTestLLMConnection}
        handleLLMChange={handleLLMChange}
      />
    </div>
  );
}

const MODELS: {[key: string]: string[]} = {
  OPENAI: ['GPT-4-O', 'GPT-4-TURBO'],
  GOOGLE: ['GEMINI-1.5-FLASH-LATEST', 'GEMINI-PRO-VISION'],
  ANTHROPIC: ['CLAUDE-3-OPUS', 'CLAUDE-3-SONNET', 'CLAUDE-3-HAIKU'],
};

const LINKS = {
  OPENAI: 'https://platform.openai.com/api-keys',
  GOOGLE: 'https://aistudio.google.com/app/apikey',
  ANTHROPIC: 'https://console.anthropic.com/account/keys',
};

function ApiKeyInput({
  showKey,

  provider,
  apiKey,
  setApiKey,
  link,
}: {
  showKey: boolean;

  provider: string;
  apiKey: string;
  setApiKey: (value: string) => void;
  link: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{provider}</Label>
      <div className="flex items-center space-x-2 w-full">
        <Input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder={`Enter your ${provider} API key`}
        />
        <div className="flex items-center space-x-2">
          <Button
            className="h-10"
            variant="outline"
            onClick={() => setApiKey('')}
          >
            <Trash className="w-4 h-4" />
          </Button>
          <a
            rel="noopener noreferrer"
            href={link}
            target="_blank"
          >
            <Button
              className="gap-2 h-10"
              variant="outline"
              // onClick={() => openLinkPreload(link)}
            >
              <Link className="w-4 h-4" />
              <span>Get API Key</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function LLMSecrets({
  config,
  setConfig,
  disabled,
  setDisabled,
  handleTestLLMConnection,
  handleLLMChange,
}: {
  config: Config;
  setConfig: (value: Config) => void;
  disabled: boolean;
  setDisabled: (value: boolean) => void;
  handleTestLLMConnection: () => void;
  handleLLMChange: (config: Config) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col space-y-2">
          <CardTitle>LLM Secrets</CardTitle>
          <CardDescription>Enter the API keys for the selected LLM.</CardDescription>
        </div>

        <Toggle
          pressed={showKey}
          defaultPressed={false}
          onPressedChange={() => setShowKey(!showKey)}
          className="flex items-center space-x-2"
        >
          {showKey ? <LucideEye className="w-4 h-4" /> : <LucideEyeOff className="w-4 h-4" />}
          <span>Show API Keys</span>
        </Toggle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApiKeyInput
          showKey={showKey}
          provider="OpenAI"
          link={LINKS.OPENAI}
          apiKey={config?.openaiApiKey}
          setApiKey={value => {
            setDisabled(false);
            setConfig({
              ...config,
              openaiApiKey: value,
            });
          }}
        />

        <ApiKeyInput
          showKey={showKey}
          provider="Google"
          link={LINKS.GOOGLE}
          apiKey={config?.googleApiKey}
          setApiKey={value => {
            setDisabled(false);
            setConfig({
              ...config,
              googleApiKey: value,
            });
          }}
        />

        <ApiKeyInput
          showKey={showKey}
          provider="Anthropic"
          link={LINKS.ANTHROPIC}
          apiKey={config?.anthropicApiKey}
          setApiKey={value => {
            setDisabled(false);
            setConfig({
              ...config,
              anthropicApiKey: value,
            });
          }}
        />
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button
          onClick={() => handleLLMChange(config)}
          disabled={!config?.provider || !config?.model || disabled}
        >
          Save
        </Button>
        <Button
          onClick={handleTestLLMConnection}
          variant="outline"
        >
          Test LLM Connection
        </Button>
      </CardFooter>
    </Card>
  );
}
