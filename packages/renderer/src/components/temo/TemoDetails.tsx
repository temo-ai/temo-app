import {useEffect, useRef, useState} from 'react';
import Steps from './Steps';
import Topbar from './Topbar';
import Temoplayer from './TemoPlayer';
import VideoPlayer from './VideoPlayer';
import {fetchTemo} from '../../utils/atoms';
import {useAtomValue} from 'jotai';
import {selectedTemoAtom} from '../../utils/atoms';
import {ArticleView} from './ArticleView';
import {onTemoChanged} from '#preload';

const TemoDetails = ({id}: {id: number}) => {
  const playerRef = useRef(null);
  const [startTime, setStartTime] = useState(0);
  const [activeTab, setActiveTab] = useState('article');
  const temo = useAtomValue(selectedTemoAtom);
  const recordedEvents = temo?.events;
  const [openComponent, setOpenComponent] = useState<number>(0);

  const {guide, sessionId, articles} = temo;
  const [selectedLanguage1, setSelectedLanguage1] = useState('ENGLISH');
  const [selectedArticle1, setSelectedArticle1] = useState(guide);

  useEffect(() => {
    fetchTemo(id);
    onTemoChanged(() => {
      fetchTemo(id);
    });
  }, [id]);

  useEffect(() => {
    if (selectedLanguage1 === 'ENGLISH') {
      setSelectedArticle1(temo.guide);
    } else {
      setSelectedArticle1(
        temo.articles?.find(article => article.name === selectedLanguage1)?.content || '',
      );
    }
  }, [temo, selectedLanguage1]);

  return (
    <div
      className="flex flex-1 flex-col"
      key={id}
    >
      <Topbar
        temoId={id}
        temoName={temo.name}
        temoTitle={temo.title}
        isPublished={temo.isPublished}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex w-full gap-x-2 px-3">
        <Steps
          temoId={id}
          playerRef={playerRef}
          startTime={startTime}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="rounded-lg border border-border w-full">
          {activeTab === 'video' ? (
            <VideoPlayer sessionId={sessionId} />
          ) : activeTab === 'player' ? (
            <Temoplayer
              playerRef={playerRef}
              setStartTime={setStartTime}
              recordedEvents={recordedEvents}
              openComponent={openComponent}
            />
          ) : (
            <ArticleView
              sessionId={sessionId}
              articles={articles}
              openTranslation={() => setOpenComponent(6)}
              selectedLanguage1={selectedLanguage1}
              setSelectedLanguage1={setSelectedLanguage1}
              selectedArticle1={selectedArticle1}
              setSelectedArticle1={setSelectedArticle1}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default TemoDetails;
