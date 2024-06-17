import {readConfigFile} from './constants';
import {Octokit} from '@octokit/rest';
import {fetchTemos, fetchTemo, updateTemoThumbnailUrl} from '../handlers/temo';
import {fetchFiles} from '../handlers/fetchFiles';
import {handleFetchEvent} from '../handlers/handleFetchEvent';
import fs from 'fs/promises';
import {updateTemoPublishStatus} from '../handlers/temo';
import {put, list, del} from '@vercel/blob';

interface params {
  temoId: number;
}

interface FileToUpdate {
  path: string;
  content: string;
  type: string;
}

async function prepareFilesToUpdate(temoId: number): Promise<FileToUpdate[]> {
  const temoData = await fetchTemo(temoId);
  const events = await handleFetchEvent(temoData?.sessionId);
  const {articles, thumbnail} = await fetchFiles(temoData?.sessionId);
  const path = `temos/${temoData?.sessionId}`;

  return [
    {
      path: `${path}/events.json`,
      content: JSON.stringify(events),
      type: 'application/json',
    },
    {
      path: `${path}/thumbnail.png`,
      content: thumbnail,
      type: 'image/png',
    },
    ...articles.map((article: {name: string; content: string}) => ({
      path: `${path}/${article.name}.md`,
      content: article.content,
      type: 'text/markdown',
    })),
  ];
}

export async function publishToVercel({temoId}: params): Promise<boolean> {
  const config = await readConfigFile();
  await updateTemoPublishStatus(Number(temoId), true);
  const filesToUpdate = await prepareFilesToUpdate(temoId);

  try {
    for (const file of filesToUpdate) {
      try {
        const {url, pathname} = await put(file.path, Buffer.from(file.content), {
          access: 'public',
          token: config?.blobToken,
        });
        if (pathname.includes('thumbnail')) {
          updateTemoThumbnailUrl(temoId, url);
        }
      } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
      }
    }
    await updateTemosConfig();

    console.log('Data pushed to Vercel for Temo ID:', temoId);
    return true;
  } catch (error: any) {
    console.error('Error publishing to Vercel:', error);
    throw error;
  }
}
export async function unpublishFromVercel({temoId}: {temoId: number}): Promise<any> {
  const config = await readConfigFile();
  await updateTemoPublishStatus(Number(temoId), false);
  const temoData = await fetchTemo(temoId);
  try {
    const {blobs} = await list({
      prefix: `temos/${temoData?.sessionId}/`,
      token: config.blobToken,
    });

    for (const blob of blobs) {
      await del(blob.url, {
        token: config.blobToken,
      });
    }

    await updateTemosConfig();
    console.log(`Unpublished temo with ID: ${temoId}`);
    return true;
  } catch (error) {
    console.error('Error unpublishing from Vercel:', error);
    throw error;
  }
}

export async function fetchVercelHostName(blobToken: string): Promise<string> {
  try {
    const path = 'temos/hostname.txt';
    const content = 'TEST';
    const response = await put(path, Buffer.from(content), {
      access: 'public',
      token: blobToken,
    });

    const url = new URL(response.url);
    const hostName = url.hostname;

    // Delete the text file
    await del(response.url, {
      token: blobToken,
    });

    return hostName;
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw error;
  }
}

async function updateTemosConfig() {
  const config = await readConfigFile();
  const allTemos = await fetchTemos();
  // @ts-ignore
  const temos = allTemos.filter((temo: any) => !!temo?.isPublished);

  const temosWithoutChatHistory = temos.map((temo: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {chatHistory, ...temoWithoutChatHistory} = temo;
    return temoWithoutChatHistory;
  });

  const {blobs} = await list({
    prefix: 'temos/',
    token: config?.blobToken,
  });
  for (const blob of blobs) {
    if (blob.pathname === 'temos/temos.json') {
      console.log('Deleted temos.json', blob);
      await del(blob.url, {
        token: config?.blobToken,
      });
    }
  }

  const file = {
    path: 'temos/temos.json',
    content: JSON.stringify(temosWithoutChatHistory),
    type: 'application/json',
  };
  await put(file.path, Buffer.from(file.content), {
    access: 'public',
    token: config?.blobToken,
  });
}

export async function updateBrandConfig() {
  const config = await readConfigFile();
  let brandImageUrl;
  const {blobs} = await list({
    prefix: 'temos/',
    token: config?.blobToken,
  });
  for (const blob of blobs) {
    if (blob.pathname === 'temos/brandImage.png') {
      console.log('Deleted brandImage.png', blob);
      await del(blob.url, {
        token: config?.blobToken,
      });
    }
    if (blob.pathname === 'temos/brand.json') {
      console.log('Deleted brand.json', blob);
      await del(blob.url, {
        token: config?.blobToken,
      });
    }
  }
  // Read the image file from the config brandImage path
  const brandImagePath = config?.brandImage;
  if (brandImagePath) {
    const brandImageBuffer = await fs.readFile(brandImagePath);
    // Upload the image file to the blob

    const imageFile = {
      path: 'temos/brandImage.png',
      content: brandImageBuffer,
      type: 'image/png',
    };
    const {url} = await put(imageFile.path, imageFile.content, {
      access: 'public',
      token: config?.blobToken,
    });
    brandImageUrl = url;
  }
  if (config?.brandName) {
    // Upload the config file to the blob
    const configFile = {
      path: 'temos/brand.json',
      content: JSON.stringify({
        brandName: config?.brandName,
        brandImage: brandImageUrl,
      }),
      type: 'application/json',
    };
    await put(configFile.path, Buffer.from(configFile.content), {
      access: 'public',
      token: config?.blobToken,
    });
  }
}

export async function publishToGithub({temoId}: params): Promise<boolean> {
  const config = await readConfigFile();
  const octokit = new Octokit({auth: config.authToken});
  const [owner, repo] = config.repo.split('/').slice(-2);
  await updateTemoPublishStatus(Number(temoId), true);
  const filesToUpdate = await prepareFilesToUpdate(temoId);

  try {
    for (const file of filesToUpdate) {
      let sha: string | undefined;
      try {
        const {data} = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: 'main',
        });
        sha = (data as {sha: string}).sha;
      } catch (error: any) {
        if (error.status !== 404) {
          throw new Error(`Failed to get content for ${file.path}: ${error.message}`);
        }
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: `Updating ${file.path.split('/').pop()} for temo: ${temoId}`,
        content: Buffer.from(file.content).toString('base64'),
        sha,
        branch: 'main',
      });
    }

    console.log('Data pushed to GitHub for Temo ID:', temoId);
    return true;
  } catch (error: any) {
    console.error('Error publishing to GitHub:', error);
    throw error;
  }
}
