import {useState, useEffect} from 'react';
import {CornerDownLeft} from 'lucide-react';
import {
  updateTemoChatHistory,
  generateArticle,
  updateArticle as updateArticlePreload,
} from '#preload';
import {Button} from '../ui/button';
import {Textarea} from '../ui/textarea';
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip';
import {useAtomValue} from 'jotai';
import {selectedTabIdAtom, selectedTemoAtom} from '../../utils/atoms';
import {toast} from 'sonner';
import {fetchTemo} from '../../utils/atoms';
import {Toggle} from '../ui/toggle';

export default function AIChat({setArticle}: AIChatProps) {
  const [chatInput, setChatInput] = useState<string>('');
  const [localChatHistory, setLocalChatHistory] = useState<ChatHistoryItem[]>([]);
  const [generateNew, setGenerateNew] = useState(false);
  const selectedTabId = useAtomValue(selectedTabIdAtom);
  const temo = useAtomValue(selectedTemoAtom);
  const {transcription, guide, sessionId, chatHistory} = temo;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializedHistory = initializeChatHistory();
    if (initializedHistory) {
      setLocalChatHistory(initializedHistory);
    }
  }, [chatHistory, transcription]);

  const initializeChatHistory = (): ChatHistoryItem[] => {
    if (chatHistory?.length === 0) {
      return transcription
        ? [
            {
              role: 'user',
              message: 'VoiceOver: ' + transcription,
              id: 0,
              content: null,
            },
          ]
        : [];
    } else if (chatHistory?.length > 0) {
      return chatHistory;
    }
    return [];
  };

  const handleSuccess = (data: string, message: string, newUserMessage: ChatHistoryItem) => {
    setArticle(data);
    const newAssistantMessage = {
      role: 'assistant',
      message,
      id: localChatHistory.length,
      content: data,
    };

    setLocalChatHistory(prevChatHistory => [...prevChatHistory, newAssistantMessage]);

    updateTemoChatHistory({
      sessionId,
      chatHistory: [...localChatHistory, newUserMessage, newAssistantMessage],
    });
    return `${message} successfully!`;
  };
  const handleError = (error: any) => error?.message;

  const updateArticle = async () => {
    if (!chatInput) return;

    const newUserMessage = {
      role: 'user',
      message: chatInput,
      id: localChatHistory.length,
      content: null,
    };

    setLocalChatHistory(prevHistory => [...prevHistory, newUserMessage]);

    setLoading(true);

    const myPromise = generateNew
      ? generateArticle({sessionId, customPrompt: chatInput})
      : updateArticlePreload({
          sessionId,
          article: guide,
          customPrompt: chatInput,
        });

    toast.promise(myPromise, {
      loading: generateNew ? 'Generating Article...' : 'Updating Article...',
      success: data => {
        return handleSuccess(
          data,
          generateNew ? 'Article Generated' : 'Article Updated',
          newUserMessage,
        );
      },
      error: error => handleError(error),
    });

    try {
      await myPromise;
      fetchTemo(selectedTabId);
    } catch (error) {
      console.error('Failed to generate guide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 flex flex-col justify-end h-full">
      <ChatHistory localChatHistory={localChatHistory} />
      <ChatInput
        chatInput={chatInput}
        setChatInput={setChatInput}
        loading={loading}
        updateArticle={updateArticle}
        generateNew={generateNew}
        setGenerateNew={setGenerateNew}
      />
    </div>
  );
}

const Message = ({message}: MessageProps) => (
  <div
    key={message.id}
    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`max-w-xs py-1 px-2 rounded-lg ${
        message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <div className="whitespace-pre-wrap">{message.message}</div>
      {/* {message.content && (
        <div className="whitespace-pre-wrap">{message.content}</div>
      )} */}
    </div>
  </div>
);

const ChatHistory = ({localChatHistory}: {localChatHistory: ChatHistoryItem[]}) => (
  <div className="flex flex-col space-y-2 h-[calc(100vh-380px)] overflow-y-scroll px-4">
    {localChatHistory?.map((message, index) => (
      <Message
        key={index}
        message={message}
      />
    ))}
  </div>
);
const ChatInput = ({
  chatInput,
  setChatInput,
  loading,
  updateArticle,
  generateNew,
  setGenerateNew,
}: {
  chatInput: string;
  setChatInput: (input: string) => void;
  loading: boolean;
  updateArticle: () => void;
  generateNew: boolean;
  setGenerateNew: (generate: boolean) => void;
}) => {
  return (
    <div className="flex flex-col border border-input rounded-lg p-2">
      <Textarea
        id="message"
        value={chatInput || ''}
        onChange={e => setChatInput(e.target.value)}
        disabled={loading}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            updateArticle();
          }
        }}
        placeholder={
          generateNew
            ? 'Write a prompt for the AI to generate a new article based on the prompt and the images...'
            : 'Write a prompt for the AI to make changes to the current article...'
        }
        className="min-h-12 resize-none p-3 shadow-none border-none"
      />
      <div className="flex flex-row justify-between mt-2">
        <div className="flex flex-row space-x-2">
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                variant="default"
                className="gap-1.5"
                pressed={generateNew}
                onPressedChange={setGenerateNew}
              >
                {generateNew ? 'Images + Prompt' : 'Article + Prompt'}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              Will create a fresh article based on the prompt and all step images recorded.
            </TooltipContent>
          </Tooltip>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          variant={chatInput.length > 0 ? 'default' : 'ghost'}
          onClick={updateArticle}
          disabled={chatInput.length === 0}
        >
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};

interface AIChatProps {
  setArticle: (article: string) => void;
  article: string;
}

interface MessageProps {
  message: {
    role: string;
    message: string;
    id: number;
    content: string | null;
  };
}

interface ChatHistoryItem {
  role: string;
  message: string;
  id: number;
  content: string | null;
}
