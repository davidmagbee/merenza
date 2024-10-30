# Medical Q&A Application Documentation

## 1. Project Setup Guide

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account
- OpenAI API key

### Installation Steps

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd medical-assistant-firebase
npm install
```

2. Install required dependencies:
```bash
npm install firebase react-speech-recognition axios @openai/api
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

4. Set up Firebase:
   - Create a new Firebase project
   - Enable Firebase Storage
   - Upload your medical_questions_and_answers.txt file to Firebase Storage
   - Set appropriate security rules for Firebase Storage

5. Start the development server:
```bash
npm start
```

## 2. Interface Features

The application provides a minimalist interface with the following features:

### Audio Capture
- Start/Stop buttons for audio recording
- Real-time transcription display
- Error handling for browser compatibility

### Question Analysis
- Automatic detection of questions from transcribed text
- Support for various question types (what, why, how, when, where)
- Real-time question extraction

### Answer Generation
- Primary answer source: Firebase Storage document
- Fallback to OpenAI for questions without document matches
- Real-time answer display with loading states

## 3. Code Structure Overview

### Component Architecture

```
src/
├── components/
│   ├── AudioCapture.js     # Handles audio recording and transcription
│   └── QuestionAnalyzer.js # Processes transcribed text for questions
├── services/
│   └── answerService.js    # Manages answer retrieval and AI integration
├── firebase/
│   └── firebaseConfig.js   # Firebase configuration and initialization
└── App.js                  # Main application component
```

### Technical Choices

1. **React.js Frontend**
   - Used functional components with hooks for state management
   - Implemented real-time updates using useEffect and useState
   - Modular component structure for maintainability

2. **Firebase Integration**
   - Firebase Storage for document storage
   - Real-time data access
   - Secure credential management

3. **Audio Processing**
   - react-speech-recognition for browser-based audio capture
   - Real-time transcription capabilities
   - Error handling for browser compatibility

4. **AI Integration**
   - Primary source: Firebase-stored document
   - Secondary source: OpenAI API via WebSocket
   - Fallback mechanism for unknown questions

### Key Features Implementation

1. **Audio Capture**
   - Uses Web Speech API through react-speech-recognition
   - Continuous recording with start/stop functionality
   - Real-time transcription updates

2. **Question Detection**
   - Pattern matching for question words
   - Sentence parsing and filtering
   - Error handling for edge cases

3. **Answer Generation**
   - Two-tier answer system:
     1. Document lookup in Firebase
     2. AI-generated responses for missing answers
   - Asynchronous processing with Promise handling
   - Error management and fallback mechanisms

### Error Handling

- Browser compatibility checks
- WebSocket connection management
- Firebase connection error handling
- Transcription error management
- Answer retrieval error handling

### Performance Considerations

- Minimal state updates
- Efficient document searching
- Optimized WebSocket usage
- Error boundary implementation
- Resource cleanup on component unmount