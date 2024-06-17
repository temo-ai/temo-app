[![.github/workflows/ci.yml](https://github.com/temo-ai/temo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/temo-ai/temo-app/actions/workflows/ci.yml)

# Temo

Temo is an Electron-based application that allows users to record their browsing sessions, store the data locally, and process it using AI models from OpenAI, Anthropic, and Google to generate step-by-step guides and documentation.

## Features

- **Session Recording**: Capture user interactions, including mouse movements, clicks, keystrokes, and form inputs using the rrweb library.
- **Voice-Over & Voice Cloning**: Record voice-overs or use AI-powered voice cloning to generate realistic voice-overs.
- **Article Generation**: Utilize LLM to generate textual articles summarizing recordings.
- **Translations**: Support for multi-language voice-overs and articles.
- **Local Data Storage**: Store all data locally with options for secure backups.
- **Customization & Branding**: Customize the appearance and branding of the app and generated content.
- **Sharing & Collaboration**: Share demos and articles with others by publishing them to your self-hosted Vercel deployment.
- **Analytics & Insights**: Track and collect usage metrics and provide intelligent insights.

## Supported LLM Providers and Models

Temo supports the following LLM providers and models for generating content:

### LLM Providers

- OpenAI
- Anthropic
- Google

### Models

- GPT 4O
- GPT 4 Turbo
- GEMINI 1.5 Flash Latest
- GEMINI PRO Vision
- CLAUDE 3 Opus
- CLAUDE 3 Sonnet
- CLAUDE 3 Haiku

## Tech Stack

### Frontend

- React
- Jotai (state management)
- Radix UI
- Framer Motion
- Lucide React
- Tailwind CSS
- Shadcn
- CMDK
- Sonner
- RRWeb
- Geist

### Backend

- Electron
- Node.js
- LowDB (simple JSON database)
- Fluent FFmpeg (Video and audio processing)
- Jimp (image processing)
- Electron Updater

### AI & LLM

- Langchain
- OpenAI
- Anthropic
- Google Vertex AI
- Google Gen AI

### Utilities

- TypeScript
- Vite
- Electron Builder
- Vitest
- ESLint
- Prettier
- Octokit

## Getting Started

### Prerequisites

- Node.js
- npm
- ffmpeg

### Installation

1. Clone the repository:

```sh
git clone https://github.com/temo-ai/temo-app.git
```

2. Install dependencies:

```sh
cd temo-app
npm install
```

3. Install ffmpeg:

```sh
brew install ffmpeg
```

### Development

To start the development server:

```sh
npm run watch
```

### Building for Production

To build the project for production:

```sh
npm run compile
```

To create a distributable package:

```sh
npm run distribute
```

## Contributing

We welcome contributions to Temo! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with descriptive messages
4. Push your changes to your forked repository
5. Open a pull request, detailing the changes you've made

Please ensure your code follows the project's coding style and includes appropriate tests.

## License

Temo is released under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for more details.

This license ensures that any derivative works or modifications of Temo are also released under the same open-source license, promoting transparency and collaboration within the community.

## Contact

If you have any questions, issues, or suggestions, please feel free to open an issue on the [GitHub repository](https://github.com/temo/temo/issues) or contact the project maintainers directly.

We appreciate your interest in Temo and look forward to your contributions!
