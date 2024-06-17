import fs from 'fs';
import {join} from 'path';
import {generateGuideContent, translateGuideContent, updateGuideContent} from './ai';
import {fetchImagesBase64, saveGuideContent, readGuideContent} from './events';
import {updateTemoTitle} from './temo';
import {getFilePaths} from './getFilePaths';

// Define types for function parameters and return values

interface TranslateArticleParams {
  sessionId: string;
  language: string;
}

export async function generateArticle({
  sessionId,
  customPrompt,
}: {
  sessionId: string;
  customPrompt: string;
}) {
  try {
    console.log('Generating article...', {sessionId, customPrompt});
    const {guideFilePath} = getFilePaths(sessionId);
    const imagesBase64 = await fetchImagesBase64(sessionId);
    const guideContent = await generateGuideContent({
      customPrompt,
      images: imagesBase64 || [],
    });
    const cont = guideContent.toString();
    console.log('Generated article:', cont);
    const firstHeadingMatch = cont?.match(/^#\s+(.*)/m);
    const firstHeading = firstHeadingMatch ? firstHeadingMatch[1] : null;
    console.log('First heading of the guide content:', firstHeading);
    if (firstHeading) {
      updateTemoTitle(sessionId, firstHeading);
    }
    await saveGuideContent({
      filePath: guideFilePath,
      content: cont,
    });
    return cont;
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
}

export async function updateArticle({
  article,
  customPrompt,
  sessionId,
}: {
  article: string;
  customPrompt: string;
  sessionId: string;
}) {
  const {guideFilePath} = getFilePaths(sessionId);
  const updatedGuideContent = await updateGuideContent({
    content: article,
    customPrompt,
  });
  await saveGuideContent({
    filePath: guideFilePath,
    content: updatedGuideContent,
  });
  return updatedGuideContent;
}

export async function translateArticle({sessionId, language}: TranslateArticleParams) {
  try {
    const {guideFilePath, articlesDir} = getFilePaths(sessionId);
    const guideContent = await readGuideContent(guideFilePath);
    const translatedGuideContent = await translateGuideContent({
      article: guideContent,
      language,
    });

    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, {recursive: true});
    }
    const cont = translatedGuideContent.toString();
    const translatedGuideContentPath = join(articlesDir, `${language}.md`);
    await saveGuideContent({
      filePath: translatedGuideContentPath,
      content: cont,
    });
    return cont;
  } catch (error) {
    console.error('Error translating article:', error);
    throw error;
  }
}
