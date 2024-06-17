import fs from 'fs';
import {getFilePaths} from './getFilePaths';

export async function handleFetchEvent(sessionId: string | undefined) {
  try {
    if (!sessionId) {
      return [];
    }
    const {eventsFilePath} = getFilePaths(sessionId);
    if (!fs.existsSync(eventsFilePath)) {
      return [];
    }

    const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf8'));
    return events;
  } catch (error) {
    console.error('Error fetching event:', error);
    return [];
  }
}
