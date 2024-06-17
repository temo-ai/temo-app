import type React from 'react';
import {useCallback} from 'react';
import {ArrowLeft, ArrowRight, RefreshCcw} from 'lucide-react';
import {
  goBack as goBackPreload,
  goForward as goForwardPreload,
  reloadPage as reloadPagePreload,
} from '#preload';

export const RecorderControls: React.FC = () => {
  const goBack = useCallback(async () => {
    await goBackPreload();
  }, []);

  const goForward = useCallback(async () => {
    await goForwardPreload();
  }, []);

  const reloadPage = useCallback(async () => {
    await reloadPagePreload();
  }, []);

  return (
    <>
      <button
        className="rounded-2xl pl-2 mr-3 transition-all"
        onClick={goBack}
      >
        <ArrowLeft size={17} />
      </button>
      <button
        className="rounded-2xl pr-2 transition-all"
        onClick={goForward}
      >
        <ArrowRight size={17} />
      </button>
      <button
        className="mx-2"
        onClick={reloadPage}
      >
        <RefreshCcw size={15} />
      </button>
    </>
  );
};
