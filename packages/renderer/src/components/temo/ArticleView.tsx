import type React from 'react';
import {useEffect, useMemo, useState} from 'react';
import Editor from './Editor';
import {Bot} from 'lucide-react';
import {toast} from 'sonner';
import {Skeleton} from '../ui/skeleton';
import {ReusableSelect} from '../helper/ReusableSelect';
import {ResizablePanelGroup, ResizablePanel, ResizableHandle} from '../ui/resizable'; // Import the necessary components
import {useAtom} from 'jotai';
import {configAtom} from '../../utils/atoms';
import {Toggle} from '../ui/toggle';
import AIChat from './AIChat';
import {saveGuide, translateArticle} from '#preload';

interface Article {
  name: string;
  content: string;
}

interface ArticleViewProps {
  sessionId: string;
  articles: Article[];
  openTranslation: () => void;
  selectedLanguage1: string;
  setSelectedLanguage1: React.Dispatch<React.SetStateAction<string>>;
  selectedArticle1: string;
  setSelectedArticle1: React.Dispatch<React.SetStateAction<string>>;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  sessionId,
  articles,
  selectedLanguage1,
  setSelectedLanguage1,
  selectedArticle1,
  setSelectedArticle1,
}) => {
  const [config] = useAtom(configAtom);
  const [loading, setLoading] = useState(false);
  const [split, setSplit] = useState(false);

  const selectedLanguages = config?.selectedLanguages;

  useEffect(() => {
    if (selectedArticle1) {
      localStorage.removeItem('novel__content');
    }
  }, [selectedArticle1]);

  const handleUpdate = async (doc: any) => {
    try {
      await saveGuide(sessionId, doc);
      // toast.success('Guide saved successfully!');
    } catch (error) {
      toast.error('Failed to save guide.');
      console.error(error);
    }
  };

  const handleTranslate = async (name: string) => {
    const myPromise = translateArticle(sessionId, name);
    toast.promise(myPromise, {
      loading: 'Translating Article...',
      success: () => {
        setLoading(false);
        return 'Article translated successfully!';
      },
      error: error => {
        setLoading(false);
        return error.message;
      },
    });
    try {
      await myPromise;
      setSelectedLanguage1(name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageSelection1 = (name: string) => {
    if (articles.find(article => article.name === name)) {
      setSelectedLanguage1(name);
    } else {
      setLoading(true);
      setSelectedLanguage1(name);
      handleTranslate(name);
    }
  };

  const languageOptions = useMemo(() => {
    const arr: {label: string; value: string}[] = [];
    selectedLanguages?.forEach(language => {
      arr.push({
        label: toTitleCase(language),
        value: language,
      });
    });
    return arr;
  }, [selectedLanguages]);
  return (
    <div className="w-full">
      <div className="border-b border-border w-full flex flex-col">
        <div className="flex items-center justify-between p-2 w-full">
          <ReusableSelect
            options={languageOptions}
            onChange={handleLanguageSelection1}
            value={selectedLanguage1}
            placeholder="Select A Language"
          />

          <Toggle
            pressed={split}
            onPressedChange={setSplit}
          >
            <Bot />
          </Toggle>
        </div>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full"
      >
        <ResizablePanel className="min-w-[800px] w-full">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <Editor
              key={selectedArticle1}
              defaultValue={selectedArticle1 || ''}
              onChange={handleUpdate}
            />
          )}
        </ResizablePanel>
        {split && (
          <>
            <ResizableHandle />
            <ResizablePanel className="min-w-[500px]">
              <AIChat
                setArticle={setSelectedArticle1}
                article={selectedArticle1}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] p-8 space-y-4 w-full">
      <Skeleton className="w-[500px] h-[60px]" />
      {arr?.map((_, index) => (
        <Skeleton
          key={index}
          className={`w-[${index + 1}0%] h-[40px]`}
        />
      ))}
      <Skeleton className="w-full h-[40px]" />
    </div>
  );
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
