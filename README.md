# AI Mix

A comprehensive React application that provides various AI-powered tools and utilities using Ollama.

## Features

- **Chat Assistant** - Interactive AI chat interface
- **Text Generation** - Generate creative content
- **Language Translation** - Translate text between languages
- **Sentiment Analysis** - Analyze text sentiment
- **Code Generation** - Generate code snippets
- **Email Assistant** - Help with email composition
- **Poetry Generator** - Create poems and creative writing
- **Title Generator** - Generate catchy titles
- **Q&A System** - Ask questions and get answers
- **Story Generator** - Create engaging stories
- **Recipe Generator** - Generate cooking recipes
- **Text Summarizer** - Summarize long texts
- **Code Refactoring** - Improve existing code
- **Language Detection** - Detect text language
- **Content Ideas** - Generate content ideas
- **Text Analysis** - Analyze text structure and metrics

## Prerequisites

- [Ollama](https://ollama.ai) installed and running locally
- Node.js (v18 or higher)
- Bun package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

## Usage

1. Start Ollama on your local machine
2. Run the development server:
   ```bash
   bun run dev
   ```
3. Open your browser and navigate to the local development URL
4. Configure Ollama settings (URL and model) on first launch

## Configuration

The app will prompt you to configure:
- Ollama server URL (default: http://localhost:11434)
- AI model selection from your available Ollama models

## Supported Languages

- English (EN)
- Polish (PL)
- German (DE)

## Technologies Used

- React 19
- Vite
- Lucide React (icons)
- i18next (internationalization)
- Biome (linting and formatting)

## Building for Production

```bash
bun run build
```

## Preview Production Build

```bash
bun run preview
```