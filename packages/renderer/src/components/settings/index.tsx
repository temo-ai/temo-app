import {Button} from '../ui/button';
import {GithubSettings} from './GithubSettings';
import {VercelSettings} from './VercelSettings';
import {BrandSettings} from './BrandSettings';
import {selectedSettingAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {LLMSettings} from './LLMSettings';
import {TranslationSettings} from './TranslationSettings';

export default function Settings() {
  const [selectedSetting] = useAtom(selectedSettingAtom);

  return (
    <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4 md:p-10 lg:p-20 mx-auto w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold mb-8">Settings</h1>
      </div>
      <div className="w-full items-start gap-6 grid grid-cols-12">
        <nav className="col-span-2 flex flex-col text-sm text-muted-foreground space-y-2">
          <CustomButton
            value="LLM"
            label="LLMs"
          />
          <CustomButton
            value="BRAND"
            label="Branding"
          />
          <CustomButton
            value="VERCEL"
            label="Vercel"
          />
          <CustomButton
            value="GITHUB"
            label="GitHub"
          />
          <CustomButton
            value="TRANSLATION"
            label="Translation"
          />
        </nav>

        <div className="col-span-10">
          {selectedSetting === 'LLM' && <LLMSettings />}
          {selectedSetting === 'VERCEL' && <VercelSettings />}
          {selectedSetting === 'GITHUB' && <GithubSettings />}
          {selectedSetting === 'TRANSLATION' && <TranslationSettings />}
          {selectedSetting === 'BRAND' && <BrandSettings />}
        </div>
      </div>
    </div>
  );
}

function CustomButton({value, label}: {value: string; label: string}) {
  const [selectedSetting, setSelectedSetting] = useAtom(selectedSettingAtom);
  return (
    <Button
      className="w-full"
      variant={selectedSetting === value ? 'secondarySidebar' : 'sidebar'}
      size="sidebar"
      onClick={() => setSelectedSetting(value as any)}
    >
      {label}
    </Button>
  );
}
