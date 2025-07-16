# 📺 YouTubeBuddy - AI-Powered Video Summarizer

> **An intelligent assistant to query and summarize YouTube videos and uploaded video files using advanced AI.**

## 🚀 Features

- **YouTube URL Processing**: Paste any YouTube URL and get instant summaries
- **Video File Upload**: Upload video files (MP4, AVI, MOV, etc.) for processing
- **AI-Powered Summaries**: Uses advanced language models for accurate summaries
- **Custom Questions**: Ask specific questions about video content
- **User Authentication**: Sign in with Google to save your history
- **History Management**: View, search, and manage your past summaries
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads

### Backend
- **Flask** with Python
- **LangChain** for AI processing
- **OpenAI/Google Gemini** for language models
- **Whisper** for video transcription
- **FAISS** for vector similarity search
- **YouTube Transcript API** for YouTube subtitles

### Database & Auth
- **Supabase** for authentication and database
- **PostgreSQL** for data storage

## 🏗️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Supabase account
- OpenAI API key

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the migration file in the Supabase SQL editor:
   ```sql
   -- Copy contents from supabase/migrations/create_video_summaries_table.sql
   ```

### 3. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask backend
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Sign In**: Click "Sign In" to authenticate with Google
2. **Choose Input Method**:
   - **YouTube URL**: Paste a YouTube video URL
   - **Upload Video**: Drag and drop or select a video file
3. **Ask Questions**: Customize your question or use the default summary request
4. **View Results**: Get AI-powered summaries and answers
5. **Check History**: View and manage your past summaries

## 🔧 API Endpoints

### Backend API

- `GET /api/health` - Health check
- `POST /api/summarize-url` - Summarize YouTube video
- `POST /api/summarize-upload` - Process uploaded video
- `GET /api/history/<user_id>` - Get user history
- `POST /api/ask-question` - Ask specific questions

### Example Request

```javascript
// Summarize YouTube video
fetch('/api/summarize-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    question: 'What is the main topic of this video?',
    user_id: 'user-uuid'
  })
})
```

## 📊 Database Schema

### video_summaries table
- `id` (uuid) - Primary key
- `user_id` (uuid) - References auth.users
- `video_url` (text) - YouTube URL or filename
- `video_id` (text) - YouTube video ID (nullable)
- `question` (text) - User's question
- `answer` (text) - AI-generated response
- `source_type` (text) - 'youtube' or 'upload'
- `created_at` (timestamp) - Creation time
- `updated_at` (timestamp) - Last update time

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** - users can only see their own data
- **Secure file handling** - temporary files are cleaned up after processing
- **Input validation** - URL and file type validation

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy Flask app
3. Ensure all dependencies are installed

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for Supabase

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/youtubebuddy/issues) page
2. Create a new issue if needed
3. Provide detailed information about the problem

---

⭐ **If you find this project helpful, please give it a star!** ⭐