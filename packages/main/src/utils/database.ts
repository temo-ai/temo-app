import {app} from 'electron';
import {join} from 'path';
import {JSONFilePreset} from 'lowdb/node';

// Define the structure of the database data
export interface Temo {
  id: number;
  name: string;
  sessionId: string;
  title?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  thumbnailUrl?: string;
  folderId?: number;
  isPublished?: boolean;
  publishedAt?: string;
  chatHistory?: string;
  steps?: Step[];
}

export interface Folder {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Step {
  id: number;
  temoId: number;
  screenshotPath: string;
  clickX?: number;
  clickY?: number;
  timestamp?: number;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DatabaseData {
  temos: Temo[];
  folders: Folder[];
  steps: Step[];
}

// Get the user data path and set the database path
const userDataPath = app.getPath('userData');
const dbPath = join(userDataPath, 'temo.json');

// Define the default data structure
const defaultData: DatabaseData = {
  temos: [],
  folders: [],
  steps: [],
};

async function initDatabase() {
  // Initialize the database with the default data
  const db = await JSONFilePreset<DatabaseData>(dbPath, defaultData);

  console.log('db connection', {
    temos: db?.data?.temos?.length,
    folders: db?.data?.folders?.length,
    steps: db?.data?.steps?.length,
  });
  return db;
}

const db = await initDatabase();

export default db;
