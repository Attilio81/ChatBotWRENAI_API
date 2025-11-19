# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatBot Agenti EGM is a modern React + TypeScript + Vite application that provides a multi-agent chatbot interface for EGM business operations. The application features an agent selection system with voice input capabilities and dynamic webhook routing.

## Development Commands

- `npm run dev` - Start development server with Vite and HMR
- `npm run build` - Type check with TypeScript and build for production
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Architecture

### Frontend Framework
- **React 19.1.1** with TypeScript for type safety
- **Vite 7.1.2** with @vitejs/plugin-react for fast development
- **Material-UI 7.3.2** with Emotion for component library and styling
- **Entry Point**: `src/main.tsx` renders the App component into `index.html`

### Application Structure
- **Main Component**: `src/App.tsx` - Handles routing between agent selection and chat
- **Agent Selection**: `src/components/AgentSelector.tsx` - Landing page for choosing agents
- **Chat Interface**:
  - `src/components/ChatHeader.tsx` - Shows selected agent and controls
  - `src/components/ChatMessages.tsx` - Displays conversation history
  - `src/components/ChatInput.tsx` - Input field with voice recognition
- **State Management**: `src/hooks/useChat.ts` - Centralized chat state and logic
- **Voice Recognition**: `src/hooks/useVoiceRecognition.ts` - Web Speech API integration

### Styling Architecture
- **Material-UI**: Primary component library with theming system (@mui/material, @emotion)
- **CSS Modules**: Component-specific CSS files alongside components
- **Global Styles**: `src/styles/global.css` for app-wide styling
- **Design System**: Gradient backgrounds, glassmorphism effects, responsive design
- **Assets**: Static assets stored in `src/assets/` and `public/`

## Agent Configuration

### Available Agents
1. **Agente Magazziniere** 📦
   - Test: `http://localhost:5678/webhook-test/chatbot`
   - Production: `http://localhost:5678/webhook/chatbot`

2. **Consultazione Ordini Clienti** 🛒
   - Test: `http://localhost:5678/webhook-test/chatbotimpegni`
   - Production: `http://localhost:5678/webhook/chatbotimpegni`

### Agent Features
- **Dynamic Webhook Routing**: Automatic URL selection based on environment
- **Chat Reset**: Conversation history clears when switching agents
- **Session Management**: Each agent interaction gets a unique session ID
- **Voice Input**: Web Speech API integration for hands-free interaction

## TypeScript Configuration

- **Main Config**: `tsconfig.app.json` for application code in `src/`
- **Node Config**: `tsconfig.node.json` for build tools and configuration
- **Strict Mode**: Enabled with additional linting rules (`noUnusedLocals`, `noUnusedParameters`)
- **Target**: ES2022 with modern browser support
- **Custom Types**: `src/types/` contains interfaces for Agent, Message, and ChatResponse

## Voice Recognition

### Features
- **Language**: Italian (`it-IT`) speech recognition
- **Browser Support**: Automatic detection of Web Speech API availability
- **Real-time Transcription**: Continuous speech-to-text conversion
- **Error Handling**: User-friendly error messages for unsupported browsers

### Implementation
- **Hook**: `useVoiceRecognition.ts` manages speech recognition lifecycle
- **UI Integration**: Microphone button in ChatInput with visual feedback
- **State Management**: Listening state with pulsing animation

## Linting and Code Quality

- **ESLint**: Configured with TypeScript, React Hooks, and React Refresh plugins
- **Config File**: `eslint.config.js` using the new flat config format
- **Ignored**: `dist/` directory is ignored for builds
- **Code Style**: Strict TypeScript with explicit typing for all components

## Development Notes

- **Hot Module Replacement**: Vite provides instant updates during development
- **Environment Management**: Test/Production mode handled via toggle in chat interface
- **N8N Integration**: Webhook endpoints connect to N8N automation workflows
- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints