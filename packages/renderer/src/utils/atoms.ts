import {atom, createStore} from 'jotai';
import {
  getUserDataPath,
  readConfig,
  fetchTemos as fetchTemosPreload,
  fetchTemo as fetchTemoPreload,
  fetchFolders as fetchFoldersPreload,
  deleteFolder as deleteFolderPreload,
} from '#preload';

// Create a Jotai store instance
export const store = createStore();

// Define types
export type Temo = {
  transcription: string;
  guide: string;
  articles: {name: string; content: string}[];
  mp3FilePath: string;
  sessionId: string;
  name: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  folderId: number;
  startedAt: string;
  endedAt: string;
  events: any[];
  title: string;
  isPublished: 0 | 1;
  publishedAt: string;
  chatHistory: ChatHistoryItem[];
};

export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
  id: number;
  message: string;
};

export interface Config {
  provider: string;
  model: string;
  openaiApiKey: string;
  googleApiKey: string;
  anthropicApiKey: string;
  authToken: string;
  repo: string;
  blobToken: string;
  hostname: string;
  brandName: string;
  brandImage: string;
  selectedLanguages: Language[];
}

export type Language = string;

export type allTemosType = {[id: number]: Temo};

export type LLMConfig = {
  provider: 'OPENAI' | 'GOOGLE' | 'ANTHROPIC';
  model: string;
  openaiApiKey: string;
  googleApiKey: string;
  anthropicApiKey: string;
};

export type DialogState = {
  open: boolean;
  temoName: string;
  temoTitle: string;
  temoId: number;
  folderId?: number;
};

// Atom to store the user data path
export const userDataPathAtom = atom<string>('');

export const configAtom = atom<Config>({
  provider: 'OPENAI',
  model: 'GPT-4-O',
  openaiApiKey: '',
  googleApiKey: '',
  anthropicApiKey: '',
  authToken: '',
  repo: '',
  blobToken: '',
  hostname: '',
  selectedLanguages: ['ENGLISH'],
  brandName: 'Temo',
  brandImage: '',
});

// Atom to store the selected setting
export const selectedSettingAtom = atom<'LLM' | 'GITHUB' | 'VERCEL' | 'BRAND' | 'TRANSLATION'>(
  'LLM',
);

// Atom to store the selected LLM (Large Language Model) configuration
export const selectedLLMAtom = atom<LLMConfig>({
  provider: 'OPENAI',
  model: 'GPT-4-TURBO',
  openaiApiKey: '',
  googleApiKey: '',
  anthropicApiKey: '',
});

// Atom to store the state of whether the browser is open
export const isBrowserOpenAtom = atom<boolean>(false);

// Atom to store the state of whether the command menu is open
export const isCommandMenuOpenAtom = atom<boolean>(false);
export const isCreateFolderOpenAtom = atom<boolean>(false);

// Atom to store the state of whether the rename temo dialog is open
export const isRenameTemoOpenAtom = atom<DialogState>({
  open: false,
  temoName: '',
  temoTitle: '',
  temoId: 0,
});

// Atom to store the state of whether the move to folder dialog is open
export const isMoveToFolderOpenAtom = atom<DialogState>({
  open: false,
  temoName: '',
  temoTitle: '',
  temoId: 0,
  folderId: 0,
});

// Atom to store the state of whether the delete dialog is open
export const isDeleteOpenAtom = atom<DialogState>({
  open: false,
  temoName: '',
  temoTitle: '',
  temoId: 0,
});

// Atom to store the selected AI provider
export const selectedAIProviderAtom = atom<'OPENAI' | 'ANTHROPIC' | 'GOOGLE'>('OPENAI');

// Atom to store the selected page
export const selectedPageAtom = atom<
  'HOME' | 'TEMO' | 'FOLDER' | 'COMMANDS' | 'SETTINGS' | 'RECENT'
>('HOME');

// Atom to store the selected tab ID
export const selectedTabIdAtom = atom<number | null>(null);

// Atom to store the selected folder ID
export const selectedFolderIdAtom = atom<number | null>(null);

// Atom to store all tabs
export const allTabsAtom = atom<{id: number; name: string; folderId: number}[]>([]);

// Atom to store all folders
export const allFoldersAtom = atom<{id: number; name: string; createDate: string}[]>([]);

// Atom to store all temos
export const allTemosAtom = atom<{[id: number]: Temo}>({});

// Atom to store the temos in a specific folder
export const folderTemosAtom = atom<{id: number; name: string}[]>([]);

export const publishedAtom = atom<0 | 1 | 2>(2);
export const sortOrderAtom = atom<'updatedAt' | 'createdAt' | 'title'>('updatedAt');

// Atom to get the selected temo based on the selected tab ID
export const selectedTemoAtom = atom(get => {
  const temos = get(allTemosAtom);
  const selectedId = get(selectedTabIdAtom);
  return temos[selectedId] || null;
});

export const allTemosCountAtom = atom(get => {
  const temos = get(allTemosAtom);
  return Object.keys(temos)?.length || 0;
});

// Atom to get the selected folder based on the selected folder ID
export const selectedFolderAtom = atom(get => {
  const selectedFolderId = get(selectedFolderIdAtom);
  return get(allFoldersAtom).find(folder => folder.id === selectedFolderId);
});

// Function to fetch the user data path and update the atom
export const fetchUserDataPath = async () => {
  try {
    const userDataPath = await getUserDataPath();
    store.set(userDataPathAtom, userDataPath);
  } catch (error) {
    console.error('Error fetching user data path:', error);
  }
};

// Function to fetch all temos and update the atom
export const fetchTemos = async () => {
  try {
    const temos = await fetchTemosPreload();
    const normalizedTemos = temos.reduce((acc: {[id: number]: Temo}, temo: Temo) => {
      acc[temo.id] = {
        ...temo,
        // @ts-ignore
        chatHistory: temo.chatHistory ? JSON.parse(temo.chatHistory) : [],
      };
      return acc;
    }, {});

    store.set(allTemosAtom, normalizedTemos);
  } catch (error) {
    console.log('Failed to fetch temos');
  }
};

export const fetchConfig = async () => {
  try {
    const config = await readConfig();
    store.set(configAtom, config);
  } catch (error) {
    console.log('Failed to fetch config');
  }
};

// Function to fetch a specific temo by ID and update the atom
export const fetchTemo = async (id: number) => {
  try {
    const temo = await fetchTemoPreload(id);
    store.set(allTemosAtom, prev => ({
      ...prev,
      [id]: {
        ...temo,
        chatHistory: temo.chatHistory ? JSON.parse(temo.chatHistory) : [],
      },
    }));
  } catch (error) {
    console.log('Failed to fetch temo', error);
  }
};

// Function to fetch all folders and update the atom
export const fetchFolders = async () => {
  try {
    const folders = await fetchFoldersPreload();
    store.set(allFoldersAtom, folders);
  } catch (error) {
    console.log('Failed to fetch folders');
  }
};

export const deleteFolder = async (id: number) => {
  try {
    const result = await deleteFolderPreload(id);
    console.log(result);
    if (result.success) {
      store.set(allFoldersAtom, prev => prev.filter(folder => folder.id !== id));
    }
    return true;
  } catch (error) {
    console.log('Failed to delete folder');
    throw error;
  }
};
