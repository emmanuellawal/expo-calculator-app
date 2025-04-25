# AI-Enhanced Calculator App

A modern calculator application built with Expo and React Native, featuring natural language processing capabilities powered by OpenAI's GPT-3.5-turbo.

## Features

- **Natural Language Calculations**: Ask questions in plain English like "what is 5 plus 3" or "calculate 10 percent of 50"
- **Unit Conversions**: Convert between different units naturally (e.g., "convert 5 meters to feet")
- **Scientific Calculator**: Traditional calculator interface with scientific functions
- **Cross-Platform**: Works on iOS, Android, and Web platforms
- **AI-Powered**: Leverages OpenAI's GPT-3.5-turbo for natural language processing

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- OpenAI API key

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/emmanuellawal/expo-calculator-app.git
   cd expo-calculator-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
     ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

## Project Structure

```
expo-calculator-app/
├── app/                  # Main application code
│   ├── components/      # Reusable UI components
│   ├── utils/          # Helper functions and AI integration
│   └── (tabs)/         # Tab-based navigation
├── assets/             # Images, fonts, and other static files
└── types/              # TypeScript type definitions
```

## Key Features Explained

### Natural Language Processing
- Utilizes OpenAI's GPT-3.5-turbo for understanding natural language inputs
- Converts plain English queries into mathematical expressions
- Handles complex calculations and unit conversions

### Unit Conversion System
- Supports various units including:
  - Length (meters, feet, inches, etc.)
  - Weight (kg, lbs, etc.)
  - Temperature (Celsius, Fahrenheit)
  - And more...

### Security
- Environment variables for API key management
- Secure API key handling
- No sensitive data stored in repository

## Development Tools

- **Cursor IDE**: Primary development environment with AI assistance
- **Expo**: React Native development framework
- **TypeScript**: For type-safe code
- **OpenAI API**: For natural language processing
- **Git**: Version control

## Project Documentation

- [Project Presentation](https://docs.google.com/presentation/d/1AUuPOA0jPUVuHMgUrufo-291fHzkUqrbroC4T1CG5Dk/edit?usp=sharing): Detailed presentation about the calculator app development

## Testing

Run the test suite:
```bash
npm test
```
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.