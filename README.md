# 🛡️ Yuvata - Digital Literacy Challenge

**A complete platform to learn misinformation detection through interactive challenges and real-time Instagram analysis.**

[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.99+-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-v3-yellow?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm/bun
- Python 3.8+ & pip
- Chrome/Chromium browser
- Google Gemini API Key (optional)

### Installation (2 minutes)
```bash
# 1. Install frontend dependencies
npm install

# 2. Set up Python backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

cd "Project Yuvata"
pip install -r requirements.txt

# 3. Start development servers
npm run dev  # Terminal 1: Frontend (localhost:5173)
uvicorn fastapi_server:app --reload  # Terminal 2: Backend (localhost:8000)

# 4. Load extension in Chrome
# chrome://extensions → Load unpacked → yuvata-extension/
```

---

## ✨ Features

### Web Application
- 🎮 **Interactive Quiz Game** - 10 questions across messages, emails, and Instagram posts
- 🤖 **AI-Powered Analysis** - Google Gemini integration for intelligent misinformation detection
- 📊 **Statistics & Progress** - Real-time feedback and detailed results
- 🎨 **Beautiful UI** - 40+ Shadcn/UI components with TailwindCSS
- 📱 **Responsive Design** - Works on desktop and mobile

### Chrome Extension
- 🔍 **Real-Time Analysis** - Click to analyze posts on Instagram
- 🎯 **Visual Indicators** - Color-coded risk badges (🟢 Low → 🔴 Critical)
- 📈 **Statistics Dashboard** - Risk distribution and prediction counts
- ⚠️ **Alert System** - Automatic warnings for high-risk content
- ⚡ **Caching** - Prevents duplicate API calls

---

## 📂 Project Structure

```
YUVATA/
├── src/                           # React Frontend
│   ├── pages/                     # Game pages (Home, Game, Results)
│   ├── components/                # Game UI + 40+ Shadcn components
│   ├── data/sampleQuestions.ts    # Quiz questions dataset
│   └── App.tsx                    # Main app with routing
│
├── Project Yuvata/                # Python Backend
│   ├── fastapi_server.py          # REST API server
│   ├── post_analyzer.py           # AI analysis engine
│   └── requirements.txt           # Python dependencies
│
├── yuvata-extension/              # Chrome Extension
│   ├── manifest.json              # Extension config
│   ├── content.js                 # Post extraction
│   ├── popup.html/js              # UI interface
│   └── config.js                  # Settings
│
└── [Configuration files]          # Vite, TypeScript, TailwindCSS, etc.
```

---

## 🎮 How It Works

### Game Flow
1. **Home Page** - View features and start game
2. **Quiz Questions** - Answer Real/Fake for 10 questions
3. **Optional AI Analysis** - Click "Analyze" for detailed Instagram post evaluation
4. **Results** - See score, accuracy, and tool usage statistics

### Extension Flow
1. Open Instagram.com
2. Click Yuvata extension icon
3. Click "Analyze Posts" button
4. See analysis badges on posts with risk indicators

---

## 💻 API Endpoints

### Health Check
```http
GET /health
→ { "status": "ok" }
```

### Evaluate Instagram Post
```http
POST /api/evaluate-instagram-post
Content-Type: application/json

{
  "caption": "Post text...",
  "username": "instagram_username"
}
```

**Response:**
```json
{
  "overall_risk_level": "Critical|High|Medium|Low",
  "source_credibility": "High|Medium|Low",
  "prediction": "fake|real",
  "explanation": "Detailed analysis...",
  "claims": ["claim1", "claim2"]
}
```

**API Docs:** http://localhost:8000/docs (when running)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+, TypeScript, Vite, TailwindCSS, Shadcn/UI |
| **Backend** | Python 3.8+, FastAPI, Uvicorn |
| **AI** | Google Gemini 2.0 Flash, Keyword Detection |
| **Extension** | JavaScript, Chrome Extension API v3 |
| **Testing** | Vitest, Playwright |
| **Build** | Vite, Bun, PostCSS, ESLint |

---

## 📊 Risk Classification System

### Risk Levels
- 🟢 **Low** - Normal, trustworthy content
- 🟡 **Medium** - Some suspicious indicators (free, giveaway)
- 🔴 **High** - Multiple misinformation patterns
- 🔴 **Critical** - Explicit false claims (cure instantly, conspiracy)

### Detection Factors
- Keyword matching (30+ risk indicators)
- Username credibility analysis
- Content pattern recognition
- Engagement bait detection
- Conspiracy theory markers

---

## 🎓 Sample Questions

The platform includes 10 educational questions:

```
1. Government fund scam message (Fake)
2. Phishing email (Fake)
3. Health misinformation Instagram post (Fake)
4. Legitimate college announcement (Real)
5. Security reminder email (Real)
6. Alien conspiracy Instagram post (Fake)
... and more
```

---

## 📖 Documentation

For detailed documentation, see:
- **[README_FULL.md](README_FULL.md)** - Complete guide with architecture, setup, and API docs
- **[yuvata-extension/README.md](yuvata-extension/README.md)** - Extension-specific documentation
- **[yuvata-extension/SETUP.md](yuvata-extension/SETUP.md)** - Extension installation guide

---

## 🔧 Development Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:watch      # Watch mode testing

# Backend (from "Project Yuvata/" directory)
uvicorn fastapi_server:app --reload      # Start API server
python post_analyzer.py                  # Test analysis logic
```

---

## 🌍 System Access

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend API | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Extension | Chrome toolbar | Install via `chrome://extensions` |

---

## 🔐 Security & Privacy

- ✅ No user data storage
- ✅ API calls made to localhost backend only
- ✅ Instagram post analysis is client-side triggered
- ✅ Cache is browser-local only
- ✅ No tracking or analytics

---

## 📱 Supported Platforms

| Platform | Status |
|----------|--------|
| Web App (Desktop) | ✅ Full Support |
| Web App (Mobile) | ✅ Responsive |
| Chrome Extension | ✅ Instagram.com |
| Firefox/Safari | ⚠️ Possible (need adaptation) |

---

## ❓ Troubleshooting

**Extension finds 0 posts?**
→ Scroll down on Instagram to load posts dynamically first

**API not responding?**
→ Make sure backend is running: `uvicorn fastapi_server:app --reload`

**Frontend won't load?**
→ Check Node.js version (16+) and run `npm install` again

**CORS errors?**
→ Backend has CORS enabled. If still failing, check API endpoint in `EvaluatorCard.tsx`

---

## 🎯 Features Roadmap

- [ ] Support multiple social media platforms
- [ ] User authentication and progress tracking
- [ ] Leaderboard system
- [ ] Advanced analytics dashboard
- [ ] Customizable question sets
- [ ] Offline mode
- [ ] Firefox extension

---

## 📝 License

This project is for educational purposes.

---

## 👥 Credits

Built with modern web technologies and AI integration for digital literacy education.

---

## 📞 Need Help?

1. Check [README_FULL.md](README_FULL.md) for detailed documentation
2. Review API docs at http://localhost:8000/docs
3. Check extension logs in Chrome DevTools
4. Review backend logs in terminal

---

**Made for Digital Literacy Education | 2026**

[📖 Full Documentation](README_FULL.md) | [🧩 Extension Setup](yuvata-extension/SETUP.md) | [🚀 Get Started](#-quick-start)
