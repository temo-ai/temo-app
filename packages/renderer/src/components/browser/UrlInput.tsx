import {useCallback} from 'react';
import {loadUrl as loadUrlPreload} from '#preload';

interface UrlInputProps {
  url: string;
  handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UrlInput = ({url, handleUrlChange}: UrlInputProps) => {
  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Perform navigation to the entered URL
      loadUrl();
    }
  };

  const loadUrl = useCallback(async () => {
    await loadUrlPreload(url);
  }, [url]);

  return (
    <input
      value={url}
      onChange={handleUrlChange}
      onKeyPress={handleKeyPress}
      className="w-full flex h-full items-center rounded-md  px-3 text-left text-xs  outline-none ring-1 ring-border bg-input"
      placeholder="Enter a URL and press enter"
    />
  );
};
