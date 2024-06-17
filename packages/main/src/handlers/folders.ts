import db from '../utils/database';

import type {Folder} from '../utils/database';

export async function fetchTemoFolder(_: any, id: number): Promise<any> {
  await db.read();
  const temos = db.data!.temos.filter(temo => temo.folderId === id);
  return temos;
}

export async function createFolder(_: any, folderName: string): Promise<any> {
  await db.read();
  const newFolder = {
    id: db.data!.folders.length + 1,
    name: folderName,
  };

  db.data!.folders.push(newFolder);
  await db.write();
  return {
    success: true,
    message: `Collection ${folderName} created successfully`,
  };
}

export async function fetchFolders(): Promise<Folder[]> {
  await db.read();
  return db.data!.folders;
}

export async function fetchFolder(_: any, id: number): Promise<Folder | null> {
  await db.read();
  return db.data!.folders.find(folder => folder.id === id) || null;
}

export async function updateTemoFolder(_: any, temoId: number, folderId: number): Promise<any> {
  await db.read();
  const temo = db.data!.temos.find(temo => temo.id === temoId);
  if (temo) {
    temo.folderId = folderId;
    await db.write();
  }
}

export async function removeFromFolder(_: any, temoId: number): Promise<any> {
  await db.read();
  const temo = db.data!.temos.find(temo => temo.id === temoId);
  if (temo) {
    // @ts-expect-error
    temo.folderId = null;
    await db.write();
  }
}

export async function deleteFolder(_: any, folderId: number): Promise<any> {
  await db.read();
  const folderTemos = db.data!.temos.filter(temo => temo.folderId === folderId);
  if (folderTemos.length === 0) {
    db.data!.folders = db.data!.folders.filter(folder => folder.id !== folderId);
    await db.write();
    return {
      success: true,
      message: `Collection ${folderId} deleted successfully`,
    };
  } else {
    throw new Error(`Collection ${folderId} is not empty and cannot be deleted`);
  }
}
