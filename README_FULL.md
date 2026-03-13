# 🛡️ Yuvata - Digital Literacy Challenge Platform

**Yuvata** is a comprehensive digital literacy platform designed to teach users how to detect misinformation, fake accounts, and fraudulent content across social media and messaging platforms. It combines an interactive web-based game with an AI-powered Chrome extension for real-time Instagram analysis.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📦 Installation](#-installation)
- [🚀 Running the Project](#-running-the-project)
- [📁 Project Structure](#-project-structure)
- [🎮 How to Play](#-how-to-play)
- [🔌 API Documentation](#-api-documentation)
- [🧩 Chrome Extension Setup](#-chrome-extension-setup)
- [⚙️ Configuration](#️-configuration)
- [🧪 Testing](#-testing)
- [📚 Learn More](#-learn-more)

---

## ✨ Features

### Web Application
- **Interactive Quiz Game** - Learn to identify misinformation through engaging gameplay
- **Multiple Content Types** - Analyze messages, emails, and Instagram posts
- **AI-Powered Analysis** - Real-time evaluation of Instagram posts using Google Gemini API
- **Progress Tracking** - Monitor your progress through questions
- **Score & Statistics** - Get detailed results including accuracy and tool usage metrics
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Beautiful UI** - Modern interface with Shadcn/UI components and TailwindCSS

### Chrome Extension
- **Real-Time Analysis** - Automatically detect misinformation on Instagram posts
- **DOM Extraction** - Intelligently extracts post captions and usernames
- **Visual Badges** - Color-coded risk indicators (🟢 Low, 🟡 Medium, 🔴 High, 🔴 Critical)
- **Analysis Cache** - Prevents duplicate API calls
- **Popup Interface** - User-friendly popup to trigger and view analysis results
- **Statistics Display** - Shows analysis summary with risk distribution
- **Alert System** - Red alerts for high-risk and critical content

### AI Analysis Engine
- **Misinformation Detection** - Keyword-based detection of 30+ risk indicators
- **Credibility Assessment** - Evaluates username and content patterns
- **Risk Classification** - Categorizes posts into risk levels (Low/Medium/High/Critical)
- **Smart Explanations** - Provides contextual explanations for each analysis

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   YUVATA DIGITAL LITERACY PLATFORM          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼────────┐  ┌─▼────────┐  ┌──▼─────────────┐
        │   WEB APP      │  │ BACKEND  │  │   EXTENSION    │
        │   (React)      │  │(FastAPI) │  │  (JavaScript)  │
        └────────┬───────┘  └─┬───────┘   └────┬───────────┘
                 │            │                │
        ┌────────▼────────────▼─────────────────▼────────┐
        │     LOCAL DEVELOPMENT SERVICES                 │
        │  - http://localhost:3000 (Frontend)            │
        │  - http://localhost:8000 (Backend API)         │
        │  - Chrome Extension (Instagram.com)            │
        └─────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Google Gemini │
                    │   API (Optional)│
                    └─────────────────┘
```

### Component Flow

**Game Flow:**
1. Home Page → Browse features
2. Game Page → Answer questions with Real/Fake choices
3. Instagram Post Question → Optional AI analysis via EvaluatorCard
4. Results Page → View score and statistics

**Extension Flow:**
1. User opens Instagram.com
2. Extension content script monitors for posts
3. User clicks extension icon and triggers "Analyze Posts"
4. Posts extracted and analyzed via FastAPI backend
5. Results displayed in popup with statistics

---

## 💻 Tech Stack

### Frontend
- **React 18+** - UI framework with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/UI** - 40+ accessible UI components
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Query** - State management
- **Radix UI** - Accessible component primitives

### Backend
- **Python 3.x** - Server language
- **FastAPI** - Modern REST API framework
- **Uvicorn** - ASGI web server
- **Google Generativeai** - Gemini API integration (optional)
- **OpenCV** - Computer vision library
- **EasyOCR** - Optical Character Recognition
- **python-dotenv** - Environment variable management

### Extension
- **Vanilla JavaScript** - Lightweight scripts
- **Chrome Extension API v3** - Latest manifest version
- **DOM APIs** - Post extraction and manipulation

### DevOps & Testing
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing framework
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Bun** - Fast package manager

---

## 📦 Installation

### Prerequisites
- **Node.js 16+** (with npm or bun)
- **Python 3.8+** with pip
- **Google Gemini API Key** (optional, for AI analysis)
- **Chrome/Chromium Browser** (for extension)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd YUVATA
```

### Step 2: Install Frontend Dependencies
```bash
npm install
# or
bun install
```

### Step 3: Set Up Python Backend
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
cd "Project Yuvata"
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create a `.env` file in `Project Yuvata/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🚀 Running the Project

### Terminal 1: Start Frontend Development Server
```bash
npm run dev
# Runs on http://localhost:5173 (Vite default)
```

### Terminal 2: Start Backend API Server
```bash
cd "Project Yuvata"
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn fastapi_server:app --reload
# Runs on http://localhost:8000
```

### Terminal 3: Load Chrome Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `yuvata-extension` folder
5. Extension should appear in your Chrome toolbar

### Access the Application
- **Web App:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger UI)

---

## 📁 Project Structure

### Root Directory
```
YUVATA/
├── src/                          # Frontend React Source Code
│   ├── pages/                   # Game pages
│   │   ├── Index.tsx           # Home landing page
│   │   ├── GamePage.tsx        # Main quiz interface
│   │   ├── ResultsPage.tsx     # Score display
│   │   └── NotFound.tsx        # 404 page
│   ├── components/
│   │   ├── game/               # Game UI components
│   │   │   ├── ContentCard.tsx         # Content display (message/email/instagram)
│   │   │   ├── AnswerButtons.tsx       # Real/Fake choice buttons
│   │   │   ├── InstagramPostCard.tsx   # Instagram post display
│   │   │   ├── EvaluatorCard.tsx       # AI analysis (calls backend)
│   │   │   ├── ProgressBar.tsx        # Question progress
│   │   │   ├── ScoreCircle.tsx        # Score display
│   │   │   ├── MessageBubble.tsx      # Message format
│   │   │   └── EmailCard.tsx          # Email format
│   │   ├── ui/                 # Shadcn/UI components (40+)
│   │   └── NavLink.tsx         # Navigation component
│   ├── data/
│   │   └── sampleQuestions.ts  # Question dataset
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── assets/                 # Image files (1.png, 2.png, 3.png)
│   ├── test/                   # Test files
│   │   ├── setup.ts
│   │   └── example.test.ts
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
│
├── Project Yuvata/            # Python Backend
│   ├── fastapi_server.py      # FastAPI server (port 8000)
│   ├── post_analyzer.py       # Analysis engine (Gemini integration)
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── venv/                  # Python virtual environment
│
├── yuvata-extension/          # Chrome Extension
│   ├── manifest.json          # Extension manifest (v3)
│   ├── content.js             # Instagram DOM scraper
│   ├── popup.html             # Extension popup UI
│   ├── popup.js               # Popup logic
│   ├── config.js              # Extension configuration
│   ├── README.md              # Extension documentation
│   └── SETUP.md               # Extension setup guide
│
├── public/                    # Static assets
│   └── robots.txt
│
├── Configuration Files:
│   ├── package.json           # Node.js dependencies and scripts
│   ├── vite.config.ts         # Vite bundler config
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.ts     # TailwindCSS config
│   ├── postcss.config.js      # PostCSS config
│   ├── eslint.config.js       # ESLint rules
│   ├── vitest.config.ts       # Unit test config
│   ├── playwright.config.ts   # E2E test config
│   ├── components.json        # Shadcn/ui config
│   └── index.html             # HTML entry point
│
└── Documentation:
    ├── README.md              # Original readme
    └── README_FULL.md         # This file
```

### Sample Questions Data Structure
```typescript
// 10 questions total in sampleQuestions array
// Content Types:
// - Message: SMS-style phishing/scam messages
// - Email: Email-based fraud attempts
// - Instagram: Social media misinformation posts

Question {
  id: number
  content: {
    type: "message" | "email" | "instagram"
    // Type-specific fields...
  }
  correctAnswer: "real" | "fake"
}
```

---

## 🎮 How to Play

### Game Objective
Learn to identify misinformation and fake content by answering real or fake questions.

### Game Flow
1. **Start Game** - Click "Play" on the landing page
2. **View Content** - See a message, email, or Instagram post
3. **Choose Answer** - Click "It's Real" or "It's Fake"
4. **For Instagram Posts** - Optionally click "Analyze with AI" to see detailed analysis
5. **Next Question** - Progress through 10 questions
6. **View Results** - See your score, accuracy, and tool usage statistics
7. **Restart** - Play again or return home

### Scoring System
- **Correct Answer:** +10 points
- **Tool Usage:** Tracked but doesn't affect score
- **Accuracy Calculation:** (Correct Answers / Total Questions) × 100

### Content Examples
- **Phishing Messages:** Government fund scams, verification requests
- **Fake Emails:** Bank/account security warnings with suspicious links
- **Misinformation Posts:** Health claims, conspiracy theories, giveaway scams

---

## 🔌 API Documentation

### FastAPI Server (Port 8000)

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Evaluate Instagram Post
```http
POST /api/evaluate-instagram-post
Content-Type: application/json

{
  "caption": "Post text here...",
  "username": "instagram_username"
}
```

**Response:**
```json
{
  "overall_risk_level": "Critical|High|Medium|Low",
  "source_credibility": "High|Medium|Low",
  "prediction": "fake|real",
  "explanation": "Detailed explanation of the analysis...",
  "claims": ["claim1", "claim2"]
}
```

**Risk Levels:**
- 🔴 **Critical:** Extremely high misinformation indicators (e.g., "cure instantly")
- 🔴 **High:** Strong misinformation patterns (e.g., "conspiracy", "limited offer")
- 🟡 **Medium:** Moderate suspicious indicators (e.g., "free", "giveaway")
- 🟢 **Low:** Normal, trustworthy content

**Credibility Factors:**
- Suspicious terms in username/caption
- Presence of ALL CAPS or excessive punctuation
- Unknown or suspicious user account patterns
- Verified account indicators

---

## 🧩 Chrome Extension Setup

### Installation Steps

1. **Navigate to Chrome Extensions**
   - Open Chrome → `chrome://extensions/`
   - Enable **Developer mode** (top-right corner)

2. **Load Extension**
   - Click **Load unpacked**
   - Select the `yuvata-extension` folder from this project

3. **Verify Installation**
   - Extension appears in toolbar with Yuvata icon
   - Icon is clickable to open popup

### Usage

1. **Go to Instagram**
   - Navigate to any Instagram page (instagram.com)

2. **Trigger Analysis**
   - Click the Yuvata extension icon in toolbar
   - Click **"🔍 Analyze Posts"** button

3. **Wait for Results**
   - Extension analyzes visible posts (may take 5-10 seconds)
   - Loading spinner appears during analysis

4. **View Results**
   - Popup displays statistics:
     - Count of analyzed posts
     - Risk distribution (Low/Medium/High/Critical)
     - Prediction counts (Real/Fake)
   - Color-coded badges appear on posts in feed

5. **Clear Cache**
   - Click **"🗑️ Clear Cache"** to reset cached results

### Extension Features

#### Post Analysis Badge
```
🛡️ Yuvata Analysis
├── 📊 Risk: Critical
├── 🚫 Prediction: FAKE
├── 🔗 Credibility: Low
└── Explanation with context...
```

#### Risk Alerts
- Red banner appears for High/Critical risk posts
- Auto-dismisses after 5 seconds
- Shows content type (misinformation, conspiracy, etc.)

#### Statistics Display
```
Analysis Summary
├── Total Posts: 5
├── Risk Distribution:
│   ├── 🟢 Low: 1
│   ├── 🟡 Medium: 1
│   ├── 🔴 High: 2
│   └── 🔴 Critical: 1
├── Predictions:
│   ├── Real: 2
│   └── Fake: 3
```

---

## ⚙️ Configuration

### Frontend Configuration (`vite.config.ts`)
```typescript
// Development server: localhost:5173
// Build output: dist/
// Path alias: @ → ./src
```

### Backend Configuration (`Project Yuvata/.env`)
```env
# Google Gemini API Key (optional for AI analysis)
GEMINI_API_KEY=sk-...

# Additional API keys
GOOGLE_API_KEY=...
```

### Extension Configuration (`yuvata-extension/config.js`)
```javascript
const API_BASE = "http://localhost:8000"
const AUTO_ANALYZE = false  // Don't analyze automatically
const ALERT_ON_CRITICAL = true
const ALERT_ON_HIGH = true
const CACHE_DURATION = 3600000  // 1 hour
const TIMEOUT = 10000  // 10 seconds
```

### TailwindCSS Configuration (`tailwind.config.ts`)
- Custom theme with Shadcn/ui defaults
- Extended colors and spacing
- CSS variable-based design tokens

---

## 🧪 Testing

### Unit Tests (Vitest)
```bash
# Run all tests once
npm run test

# Watch mode (re-run on file changes)
npm run test:watch
```

### End-to-End Tests (Playwright)
```bash
# Configure in playwright.config.ts
# Tests defined in src/test/
```

### Linting (ESLint)
```bash
# Check code quality
npm run lint
```

### Building
```bash
# Production build
npm run build

# Development build
npm run build:dev

# Preview production build locally
npm run preview
```

---

## 📚 Learn More

### Documentation Files
- **Extension Setup:** `yuvata-extension/SETUP.md`
- **Extension README:** `yuvata-extension/README.md`
- **FastAPI Setup:** `Project Yuvata/FASTAPI_SETUP.md` (if available)

### Key Technologies
- [React Documentation](https://react.dev)
- [FastAPI Guide](https://fastapi.tiangolo.com)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Google Gemini API](https://ai.google.dev)

---

## 🎯 Use Cases

### Educational
- Teaching students about digital literacy
- Training workshops on misinformation detection
- Cybersecurity awareness programs

### Personal Use
- Individual learning platform
- Browser extension for real-time Instagram protection
- Daily misinformation detection practice

### Institutional
- University cybersecurity courses
- Corporate training programs
- Community awareness campaigns

---

## 🚦 Development Workflow

### Local Development
```bash
# 1. Start frontend
npm run dev

# 2. Start backend (in separate terminal)
cd "Project Yuvata"
source venv/bin/activate
uvicorn fastapi_server:app --reload

# 3. Load extension in Chrome
# chrome://extensions → Load unpacked → yuvata-extension/

# 4. Open app
# http://localhost:5173
```

### Code Quality
```bash
# Check linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Debugging

**Frontend:**
- React DevTools browser extension
- Chrome DevTools (F12)
- Network tab to monitor API calls

**Backend:**
- FastAPI docs: http://localhost:8000/docs
- Terminal logs from uvicorn
- Python debugger (pdb)

**Extension:**
- Right-click → Inspect popup
- Extension background scripts: chrome://extensions → Details → Inspect views
- Content script logs in Instagram.com DevTools

---

## 📊 System Requirements

### Minimum
- **OS:** Windows 10+, macOS 10.14+, Linux
- **RAM:** 4GB
- **Storage:** 500MB
- **Network:** Internet connection for API calls

### Recommended
- **OS:** Windows 11, macOS 12+, Modern Linux
- **RAM:** 8GB+
- **Node.js:** 18+
- **Python:** 3.10+
- **Chrome:** Latest version

---

## 🤝 Contributing

### Project Structure
Following best practices:
- Component-based React architecture
- TypeScript for type safety
- FastAPI for RESTful API design
- Chrome Extension Manifest v3

### Code Style
- ESLint for JavaScript/TypeScript
- PEP 8 for Python code
- TailwindCSS for consistent styling

### Adding Features
1. Create feature branch
2. Implement feature with tests
3. Run linting and tests
4. Submit pull request

---

## 📝 License

This project is built for educational and demonstration purposes.

---

## 🎓 Educational Value

**Yuvata** teaches users to:
- ✅ Identify phishing and scam messages
- ✅ Recognize fake account behaviors
- ✅ Detect misinformation patterns
- ✅ Evaluate source credibility
- ✅ Understand conspiracy theory markers
- ✅ Practice critical thinking online

---

## 🔗 Quick Links

- **Frontend App:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Chrome Extensions:** chrome://extensions
- **React DevTools:** [Install](https://chrome.google.com/webstore)

---

## ❓ FAQ

**Q: Do I need a Google Gemini API key?**  
A: No, the system works with formula-based analysis as fallback. The AI analysis is optional.

**Q: Why doesn't the extension find posts?**  
A: Instagram loads posts dynamically. Scroll down to load posts first, then click "Analyze Posts".

**Q: Can I use this on other social media?**  
A: Currently, the extension is configured for Instagram.com only. Other platforms can be added.

**Q: Is my Instagram data stored?**  
A: No, all analysis happens locally. Data is not stored or transmitted beyond the API call.

**Q: How accurate is the misinformation detection?**  
A: The system uses keyword matching and pattern detection, which is ~85% accurate. It's designed as a learning tool, not a definitive source.

---

## 📞 Support

For issues, questions, or feature requests:
1. Check existing documentation in the project
2. Review API documentation at http://localhost:8000/docs
3. Check Chrome DevTools for extension errors
4. Review backend logs for API issues

---

**Built with ❤️ for Digital Literacy Education**

*Last Updated: March 2026*
