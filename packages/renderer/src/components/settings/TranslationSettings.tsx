import {useState} from 'react';
import {Button} from '../ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Label} from '../ui/label';
import {toast} from 'sonner';
import {configAtom} from '../../utils/atoms';
import {useAtom} from 'jotai';
import {Checkbox} from '../ui/checkbox';
import {saveConfig as saveConfigPreload} from '#preload';

export const TranslationSettings = () => {
  const [config] = useAtom(configAtom);
  const [selectedTranslateValue, setSelectedTranslateValue] = useState(
    config.selectedLanguages || [],
  );

  const handleTranslateOptionChange = (value: string) => {
    if (selectedTranslateValue?.includes(value)) {
      setSelectedTranslateValue(selectedTranslateValue?.filter(lang => lang !== value));
    } else {
      setSelectedTranslateValue([...selectedTranslateValue, value]);
    }
  };

  const saveConfig = async () => {
    try {
      await saveConfigPreload({
        ...config,
        selectedLanguages: selectedTranslateValue,
      });

      toast.success('Translation config saved successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Error saving translation config');
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Settings</CardTitle>
        <CardDescription>
          Select the language you want to use for the documentation. The content will be translated
          to the selected language automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Label>Translate to</Label>
          {LANGUAGES.map(language => (
            <div
              key={language}
              className="flex flex-row items-center gap-2"
            >
              <Checkbox
                checked={selectedTranslateValue?.includes(language)}
                onCheckedChange={() => {
                  handleTranslateOptionChange(language);
                }}
              />
              <Label>{language}</Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig}>Save</Button>
      </CardFooter>
    </Card>
  );
};

const LANGUAGES = [
  'ENGLISH',
  'SPANISH',
  'FRENCH',
  'GERMAN',
  'ITALIAN',
  'PORTUGUESE',
  'RUSSIAN',
  'KOREAN',
  'CHINESE',
  'JAPANESE',
  'HINDI',
  'BENGALI',
  'URDU',
  'TAMIL',
  'TELUGU',
  'MARATHI',
  'GUJARATI',
  'PUNJABI',
  'DUTCH',
  'TURKISH',
  'GREEK',
  'FINNISH',
  'DANISH',
  'POLISH',
  'SWEDISH',
  'NORWEGIAN',
  'HUNGARIAN',
  'CZECH',
  'ROMANIAN',
  'BULGARIAN',
  'SERBIAN',
  'UKRAINIAN',
  'HEBREW',
];

interface Language {
  label: string;
  value: string;
}
