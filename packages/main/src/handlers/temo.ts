import db from '../utils/database';

export async function createTemoSession(temoName: string) {
  const cleanupTemoName = temoName.replace(/[^a-zA-Z0-9]/g, '_');
  const sessionId = `${cleanupTemoName}-${Date.now()}`;
  const newTemo = {
    id: db.data!.temos.length + 1,
    name: temoName,
    sessionId,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  console.log('newTemo', newTemo);

  db.data!.temos.push(newTemo);
  await db.write();
  return newTemo;
}

export async function fetchTemos() {
  await db.read();
  return db.data!.temos;
}

export async function fetchTemo(id: number) {
  await db.read();
  return db.data!.temos.find(t => t.id === id) || null;
}

export async function deleteTemo(id: number): Promise<{success: boolean}> {
  await db.read();
  const index = db.data!.temos.findIndex(t => t.id === id);
  if (index !== -1) {
    db.data!.temos.splice(index, 1);
    await db.write();
    return {success: true};
  }
  return {success: false};
}

export async function updateTemo(id: number, newName: string): Promise<{success: boolean}> {
  await db.read();
  const temo = db.data!.temos.find(t => t.id === id);
  if (temo) {
    temo.name = newName;
    temo.updatedAt = new Date().toISOString();
    await db.write();
    return {success: true};
  }
  return {success: false};
}

export async function updateTemoPublishStatus(
  id: number,
  isPublished: boolean,
): Promise<{success: boolean}> {
  await db.read();
  const temo = db.data!.temos.find(t => t.id === id);
  if (temo) {
    temo.isPublished = isPublished;
    temo.publishedAt = new Date().toISOString();
    await db.write();
    return {success: true};
  }
  return {success: false};
}

export async function updateTemoTitle(
  sessionId: string,
  newTitle: string,
): Promise<{success: boolean}> {
  await db.read();
  const temo = db.data!.temos.find(t => t.sessionId === sessionId);
  if (temo) {
    temo.title = newTitle;
    await db.write();
    return {success: true};
  }
  return {success: false};
}

export const updateTemoChatHistory = async (params: {
  sessionId: string;
  chatHistory: any;
}): Promise<{success: boolean}> => {
  await db.read();
  const temo = db.data!.temos.find(t => t.sessionId === params.sessionId);
  if (temo) {
    temo.chatHistory = JSON.stringify(params.chatHistory);
    await db.write();
    return {success: true};
  }
  return {success: false};
};

export async function deleteAllTemos(): Promise<{success: boolean}> {
  await db.read();
  db.data!.temos = [];
  await db.write();
  return {success: true};
}

export async function updateTemoThumbnailUrl(
  temoId: number,
  thumbnailUrl: string,
): Promise<{success: boolean}> {
  await db.read();
  const temo = db.data!.temos.find(t => t.id === temoId);
  if (temo) {
    temo.thumbnailUrl = thumbnailUrl;
    await db.write();
    return {success: true};
  }
  return {success: false};
}

export const fetchStepsForTemo = async (temoId: number) => {
  try {
    await db.read();
    const steps = db.data!.steps.filter(step => step.temoId === temoId);
    return steps;
  } catch (error) {
    console.error('Error fetching steps for temo from database:', error);
    return [];
  }
};
