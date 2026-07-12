# Gemini Studio App

A modern React application powered by Google Gemini AI. Build intelligent interfaces with conversational AI capabilities, built with cutting-edge web technologies.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss)

## Features

- **Gemini AI Integration** — Leverage Google's Gemini model for intelligent responses
- **Modern UI** — Clean, responsive interface built with Tailwind CSS
- **Smooth Animations** — Fluid transitions powered by Motion (Framer Motion)
- **Type-Safe** — Full TypeScript coverage for reliability
- **Fast Dev Server** — Lightning-hot HMR with Vite

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| AI | Google Gemini (`@google/genai`) |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+ 
- Google AI Studio API key

### Installation

```bash
# Clone the repository
git clone https://github.com/khangglenn/gemini-studio-app.git
cd gemini-studio-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
gemini-studio-app/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Root component
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Gemini API integration
│   └── styles/           # Global styles
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Configuration

Create a `.env` file with your Google AI Studio API key:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove dist folder |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the AI API
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Motion](https://motion.dev/) for smooth animations
