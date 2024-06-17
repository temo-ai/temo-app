import {mkdir, writeFile} from 'fs/promises';
import db from '../utils/database';
import {getFilePaths} from './getFilePaths';
import fs from 'fs';

export async function handleSaveEvents(
  temoId: number,
  sessionId: string,
  events: any,
): Promise<void> {
  try {
    // Separate the directory path from the file path
    const {eventsDir, eventsFilePath} = getFilePaths(sessionId);

    // Ensure the directory exists
    if (!fs.existsSync(eventsDir)) {
      await mkdir(eventsDir, {recursive: true});
    }

    // Now write the file to the directory
    await writeFile(eventsFilePath, JSON.stringify(events, null, 2));

    // Update the database using lowdb
    await db.read();
    const temo = db.data.temos.find(t => t.id === temoId);
    if (temo) {
      temo.endedAt = new Date().toISOString();
      await db.write();
    }
    // console.log("Temo Events ended successfully", res);
  } catch (error) {
    console.error('Error saving events:', error);
  }
}
