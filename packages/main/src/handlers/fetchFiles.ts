import {readFileSync} from 'fs';
import {getFilePaths} from './getFilePaths';
import fs from 'fs';

export function fetchFiles(sessionId: string | undefined): any {
  try {
    const {mp3FilePath, transcriptionFilePath, guideFilePath, articlesDir, thumbnailFilePath} =
      getFilePaths(sessionId);

    let transcription = '';
    let guide = '';
    let articles: {name: string; content: string}[] = [];
    let thumbnail = null;

    if (fs.existsSync(thumbnailFilePath)) {
      thumbnail = readFileSync(thumbnailFilePath);
    }

    if (fs.existsSync(transcriptionFilePath)) {
      transcription = readFileSync(transcriptionFilePath, 'utf8');
    }

    if (fs.existsSync(guideFilePath)) {
      guide = readFileSync(guideFilePath, 'utf8');
    }

    if (fs.existsSync(articlesDir)) {
      // Read all files in articlesDir
      const articlesFolder = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
      articles = articlesFolder?.map(article => {
        const articleName = article.split('.')[0];
        const articleContent = fs.readFileSync(`${articlesDir}/${article}`, 'utf8');
        return {
          name: articleName,
          content: articleContent,
        };
      });
    }

    return {transcription, guide, mp3FilePath, articles, thumbnail};
  } catch (error) {
    console.error('Error fetching transcription:', error);
  }
}
