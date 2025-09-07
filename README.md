# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Dispute Resolution Platform Demo

A demo chat application built with React, TypeScript, and Vite that demonstrates a blockchain-powered dispute resolution platform with MetaMask integration.

## Features

### Authentication
- **MetaMask Integration**: Users must connect and authenticate with an Ethereum wallet
- **Persistent Sessions**: Authentication state is maintained across browser sessions
- **Account Detection**: Automatically detects account changes in MetaMask

### Chat Interface
- **Multi-type Messaging**: Support for different message types:
  - **Information Messages**: General communication
  - **Evidence Messages**: Require proof submission and fact-checking
- **Real-time Interface**: Responsive chat UI with message history
- **System Responses**: Automated responses for evidence submissions

### Policies Management
- **Policy Viewing**: Display agreed-upon policies and guidelines
- **Version Tracking**: Track policy versions and agreement dates
- **Expandable Content**: Collapsible policy details for better UX

### Evidence Handling
- **Dual-sided Evidence**: Support for both claimant and defendant evidence
- **Fact-checking Status**: Track verification status of submitted evidence
- **Evidence Categories**: Organized evidence submission and viewing
- **Attachment Support**: Support for evidence attachments (mocked for demo)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Blockchain**: Ethers.js for Ethereum interaction
- **Styling**: Custom CSS with responsive design
- **Icons**: Lucide React
- **State Management**: React hooks and context

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat interface
│   ├── EvidenceView.tsx     # Evidence management
│   ├── PoliciesView.tsx     # Policy viewing
│   └── WalletConnect.tsx    # MetaMask connection
├── contexts/           # React contexts
│   └── AuthContext.tsx     # Authentication state
├── hooks/              # Custom hooks
│   ├── useChat.ts          # Chat message management
│   ├── useEvidence.ts      # Evidence handling
│   └── usePolicies.ts      # Policy management
├── types/              # TypeScript definitions
│   ├── ethereum.d.ts       # MetaMask type definitions
│   └── index.ts           # Main type exports
├── App.tsx             # Main application component
├── App.css             # Application styles
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ClientDemoUI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### MetaMask Setup

1. Install MetaMask from [metamask.io](https://metamask.io/)
2. Create or import an Ethereum wallet
3. Connect to any Ethereum network (Mainnet, testnet, or local)
4. Click "Connect MetaMask" in the application

## Usage

1. **Connect Wallet**: Click the "Connect MetaMask" button and approve the connection
2. **Navigate Tabs**: Use the navigation to switch between Chat, Policies, and Evidence
3. **Send Messages**: 
   - Choose between "General Message" and "Evidence Submission"
   - Type your message and click send
4. **View Policies**: Review the agreed-upon policies and guidelines
5. **Manage Evidence**: 
   - View evidence from both claimant and defendant
   - Submit new evidence using the "Add Evidence" button

## API Integration

The application is structured for easy API integration:

- **Message Submission**: `useChat` hook ready for API endpoints
- **Evidence Management**: `useEvidence` hook prepared for backend integration  
- **Policy Loading**: `usePolicies` hook structured for API calls
- **Authentication**: Wallet address available for user identification

### Mock Data

Currently uses mock data for demonstration:
- Sample policies with versions and agreement dates
- Example evidence from both parties
- Simulated API delays and responses

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components with props interfaces
- **Hooks**: Custom hooks for state management and API calls
- **Types**: Comprehensive TypeScript definitions
- **Context**: Global state management for authentication

## Future Enhancements

- Real API integration
- File upload for evidence attachments
- Real-time messaging with WebSocket
- Multi-language support
- Dark mode theme
- Mobile app version
- Smart contract integration for evidence verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for demonstration purposes. Please check the license file for more details.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
