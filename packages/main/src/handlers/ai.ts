import {HumanMessage, SystemMessage} from '@langchain/core/messages';
import {ChatOpenAI} from '@langchain/openai';
import {ChatAnthropic} from '@langchain/anthropic';
import {ChatGoogleGenerativeAI} from '@langchain/google-genai';

import {readConfigFile} from '../utils/constants';
import {
  GUIDE_SYSTEM_PROMPT,
  ARTICLE_UPDATE_SYSTEM_PROMPT,
  TRANSLATE_PROMPT,
} from '../utils/PROMPTS';

enum AIProviderType {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GOOGLE = 'GOOGLE',
}

enum Models {
  'CLAUDE-3-SONNET' = 'claude-3-sonnet-20240229',
  'CLAUDE-3-OPUS' = 'claude-3-opus-20240229',
  'CLAUDE-3-HAIKU' = 'claude-3-haiku-20240307',
  'GPT-4-TURBO' = 'gpt-4-turbo',
  'GPT-4-O' = 'gpt-4o',
  'GEMINI-PRO-VISION' = 'gemini-pro-vision',
  'GEMINI-1.5-FLASH-LATEST' = 'gemini-1.5-flash-latest',
}

interface AIProvider {
  invoke: (messages: (SystemMessage | HumanMessage)[]) => Promise<{content: string}>;
}

const createAIProvider = (type: AIProviderType, apiKey: string, model: string): AIProvider => {
  const providerMap = {
    [AIProviderType.OPENAI]: ChatOpenAI,
    [AIProviderType.ANTHROPIC]: ChatAnthropic,
    [AIProviderType.GOOGLE]: ChatGoogleGenerativeAI,
  };

  const ProviderClass = providerMap[type];
  return new ProviderClass({apiKey, model}) as AIProvider;
};

export const generateGuideContent = async ({
  customPrompt,
  images,
}: {
  customPrompt: string;
  images: string[];
}) => {
  try {
    const config = await readConfigFile();
    if (config.provider === AIProviderType.GOOGLE && !config.googleApiKey) {
      throw new Error('Google API key not set');
    }
    if (config.provider === AIProviderType.ANTHROPIC && !config.anthropicApiKey) {
      throw new Error('Anthropic API key not set');
    }
    if (config.provider === AIProviderType.OPENAI && !config.openaiApiKey) {
      throw new Error('OpenAI API key not set');
    }
    const model = Models[config.model as keyof typeof Models];
    const aiProvider = createAIProvider(
      config.provider as AIProviderType,
      config[`${config.provider.toLowerCase()}ApiKey`],
      model,
    );

    const imageData = images.map(image => ({
      type: 'image_url',
      image_url: {url: `data:image/png;base64,${image}`},
    }));

    const contentArray = [{type: 'text', text: `User Instructions: ${customPrompt}`}, ...imageData];
    const sysMessage = new SystemMessage(GUIDE_SYSTEM_PROMPT);
    const humanMessage = new HumanMessage({content: contentArray});

    const response = await aiProvider.invoke([sysMessage, humanMessage]);
    return response?.content ?? '';
  } catch (error) {
    console.error('Error generating guide content:', error);
    // return an Error instance
    throw error;
  }
};

export const translateGuideContent = async ({
  article,
  language,
}: {
  article: string;
  language: string;
}) => {
  try {
    const config = await readConfigFile();
    const model = Models[config.model as keyof typeof Models];
    const aiProvider = createAIProvider(
      config.provider as AIProviderType,
      config[`${config.provider.toLowerCase()}ApiKey`],
      model,
    );

    const sysMessage = new SystemMessage(TRANSLATE_PROMPT(language));
    const humanMessage = new HumanMessage({content: article});

    const response = await aiProvider.invoke([sysMessage, humanMessage]);
    return response?.content ?? '';
  } catch (error) {
    console.error('Error translating guide content:', error);
    throw error;
  }
};

export const updateGuideContent = async ({
  content,
  customPrompt,
}: {
  content: string;
  customPrompt: string;
}) => {
  const config = await readConfigFile();
  const model = Models[config.model as keyof typeof Models];
  const aiProvider = createAIProvider(
    config.provider as AIProviderType,
    config[`${config.provider.toLowerCase()}ApiKey`],
    model,
  );
  const sysMessage = new SystemMessage(ARTICLE_UPDATE_SYSTEM_PROMPT());
  const humanMessage = new HumanMessage({content: content});
  const humanMessage2 = new HumanMessage({content: customPrompt});
  console.log({sysMessage, humanMessage, humanMessage2});
  const response = await aiProvider.invoke([sysMessage, humanMessage, humanMessage2]);
  console.log({response});
  return response?.content ?? '';
};

export const testLLMConnection = async (config: any) => {
  try {
    console.log(config);
    const model = Models[config?.model as keyof typeof Models];
    const aiProvider = createAIProvider(
      config?.provider as AIProviderType,
      config[`${config?.provider.toLowerCase()}ApiKey`],
      model,
    );
    const response = await aiProvider.invoke([
      new SystemMessage("Reply with a message saying 'World!'"),
      new HumanMessage({content: 'Hello'}),
    ]);
    console.log(response);
    return response?.content;
  } catch (error) {
    console.error('Error testing LLM connection:', error);
    throw error;
  }
};
