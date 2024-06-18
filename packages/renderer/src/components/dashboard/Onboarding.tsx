import {useState, useEffect} from 'react';
import pitch from '../../../assets/pitch.png';
import {Button} from '../ui';
import {
  selectedPageAtom,
  isBrowserOpenAtom,
  selectedSettingAtom,
  selectedTabIdAtom,
  allTemosAtom,
  isCreateFolderOpenAtom,
  configAtom,
  allFoldersAtom,
  allTabsAtom,
} from '../../utils/atoms';

import type {Temo} from '../../utils/atoms';
import {useSetAtom, useAtomValue} from 'jotai';
import {Card, CardHeader, CardTitle, CardDescription, CardFooter} from '../ui/card';

export const Onboarding = () => {
  const setSelectedPage = useSetAtom(selectedPageAtom);
  const setIsBrowserOpen = useSetAtom(isBrowserOpenAtom);
  const setSelectedSetting = useSetAtom(selectedSettingAtom);
  const setSelectedTabId = useSetAtom(selectedTabIdAtom);
  const setIsCreateFolderOpen = useSetAtom(isCreateFolderOpenAtom);
  const setAllTabs = useSetAtom(allTabsAtom);

  const allTemos = useAtomValue(allTemosAtom);
  const config = useAtomValue(configAtom);
  const allFolders = useAtomValue(allFoldersAtom);
  const [step, setStep] = useState(0);

  const handleIsPublished = (temos: Temo[]) => {
    return temos?.every((temo: Temo) => temo.isPublished === 0);
  };

  useEffect(() => {
    const temoLength = Object.keys(allTemos).length;
    if (!config?.provider || !config?.model) {
      console.log('no config', 1);
      setStep(1);
    } else if (temoLength === 0) {
      console.log('no temos', 2);
      setStep(2);
    } else if (allFolders.length === 0) {
      console.log('no folders', 3);
      setStep(3);
    } else if (!config?.blobToken) {
      console.log('no blob token', 4);
      setStep(4);
    } else if (handleIsPublished(Object.values(allTemos))) {
      console.log('No published', 5);
      setStep(5);
    } else {
      setStep(0);
    }
  }, [config, allTemos, allFolders]);

  const handleNextClick = (value: number) => {
    switch (value) {
      case 1:
        setSelectedPage('SETTINGS');
        setSelectedSetting('LLM');
        break;
      case 2:
        setIsBrowserOpen(true);
        break;
      case 3:
        setIsCreateFolderOpen(true);
        break;
      case 4:
        setSelectedPage('SETTINGS');
        setSelectedSetting('VERCEL');
        break;
      case 5: {
        const firstUnpublishedTemoId = Object.keys(allTemos).find(
          (temoId: string) => !allTemos[Number(temoId)].isPublished,
        );
        if (firstUnpublishedTemoId) {
          setAllTabs(prev => {
            const isTemoAlreadyOpen = prev.some(tab => tab?.id === Number(firstUnpublishedTemoId));
            if (!isTemoAlreadyOpen) {
              return [
                ...prev,
                {
                  id: Number(firstUnpublishedTemoId),
                  name:
                    allTemos[Number(firstUnpublishedTemoId)]?.title ||
                    allTemos[Number(firstUnpublishedTemoId)]?.name,
                  folderId: allTemos[Number(firstUnpublishedTemoId)]?.folderId,
                },
              ];
            }
            return prev;
          });
          setSelectedTabId(Number(firstUnpublishedTemoId));
        }
        break;
      }
      default:
        setStep(0);
    }
  };

  return (
    <section>
      {step === 0 ? (
        <div className="relative">
          <div className="absolute right-0 bottom-0">
            <img
              src={pitch}
              width={128}
              alt="bg-image"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col rounded-md relative shadow-md space-y-3">
          <OnboardingStep
            step={step}
            value={1}
            title="Select LLM provider"
            description="Select from OpenAI, Google, or Anthropic and add your API keys for your selected provider"
            handleNextClick={handleNextClick}
          />

          <OnboardingStep
            step={step}
            value={2}
            title="Record A Temo"
            description="You can record a Temo of anything."
            handleNextClick={handleNextClick}
          />

          <OnboardingStep
            step={step}
            value={3}
            title="Create a Collection"
            description="You can create a collection of your Temos"
            handleNextClick={handleNextClick}
          />

          <OnboardingStep
            step={step}
            value={4}
            title="Deploy Temo UI to Vercel"
            description="Create a Vercel Blob store and publish your Temos"
            handleNextClick={handleNextClick}
          />

          <OnboardingStep
            step={step}
            value={5}
            title="Publish a demo"
            description="You can publish the Temo and share it with your everyone"
            handleNextClick={handleNextClick}
          />
        </div>
      )}
    </section>
  );
};

export default Onboarding;

function OnboardingStep({
  step,
  value,
  title,
  description,
  handleNextClick,
}: {
  step: number;
  value: number;
  title: string;
  description: string;
  handleNextClick: (value: number) => void;
}) {
  const isDone = step > value;
  const isActive = step === value;
  return isActive ? (
    <Card className="sm:col-span-2">
      <CardHeader className="p-2">
        <CardTitle className="text-lg">
          {isDone ? '✅' : value}. {title}
        </CardTitle>
        {isActive ? (
          <CardDescription className="text-gray-500">{description}</CardDescription>
        ) : null}
      </CardHeader>
      {isDone ? null : isActive ? (
        <CardFooter className="p-2">
          <Button onClick={() => handleNextClick(value)}>Next</Button>
        </CardFooter>
      ) : null}
    </Card>
  ) : null;
}
