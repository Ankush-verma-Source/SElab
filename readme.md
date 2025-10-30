# Questiva – AI-Powered Learning Platform (MCQs, Quizzes, Flashcards, Summaries)

An Express + EJS + MongoDB app that helps learners generate MCQs, quizzes, flashcards, and summaries using AI. Includes user authentication, a dashboard, file upload support (Cloudinary), and neatly organized EJS views.

## Features
- **AI generation**: MCQs, quizzes, flashcards, and summaries from your input/content
- **User accounts**: Signup/login with sessions using Passport (local strategy)
- **Dashboard**: Access generated content and results
- **File uploads**: Handled via `multer` with optional Cloudinary storage
- **Flash messages**: User feedback using `connect-flash`

## Tech Stack
- **Backend**: Node.js, Express
- **Views**: EJS (with `ejs-mate` layouts)
- **Database**: MongoDB + Mongoose
- **Auth**: Passport (local), `passport-local-mongoose`
- **Uploads**: Multer, Cloudinary
- **AI**: `openai` and/or `@google/genai`

## Prerequisites
- Node.js LTS and npm
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional) Cloudinary account for media storage
- API key(s) for your chosen AI provider(s)

## Getting Started

### 1) Clone and install
```bash
npm install
```

### 2) Create an .env file
Create a `.env` at the project root with at least:
```bash
# Server
PORT=3000
NODE_ENV=development
SECRET=your-session-secret

# Database
# If not set, the app currently connects to mongodb://127.0.0.1:27017/questiva in code
MONGODB_URI=mongodb://127.0.0.1:27017/questiva

# OpenAI (if you use the OpenAI provider)
OPENAI_API_KEY=your-openai-api-key

# Google GenAI (if you use the Google provider)
GOOGLE_API_KEY=your-google-genai-api-key

# Cloudinary (if you enable remote storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Note: `app.js` currently calls `mongoose.connect("mongodb://127.0.0.1:27017/questiva")`. You can keep that or refactor to use `process.env.MONGODB_URI`.

### 3) Run the app
```bash
node app.js
```
Then open `http://localhost:3000` (or your configured `PORT`).

> Tip: If you prefer auto-reload during development, install nodemon globally and run `nodemon app.js`.

## Scripts
`package.json` currently includes only a placeholder `test` script. Common additions you may want:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

## Project Structure (excerpt)
```text
mujproject_updated/
  app.js
  openai.js
  cloudinaryConfig.js
  middleware.js
  models/
    User.js
    content.js
  routes/
    dashboard/dashboard.js
    features/feature.js
    user/user.js
  views/
    layouts/boilerplate.ejs
    home.ejs
    users/login.ejs
    users/signup.ejs
    dashboard.ejs
    dashView/(mcq|quiz|flashcards|result|summary).ejs
    generate/(mcq|quiz|flashcards|result|summary).ejs
    includes/(header|flash).ejs
    error.ejs
  public/
    css/*.css
    js/*.js
```

## Key Endpoints (high level)
- `GET /` → redirects to `/home`
- `GET /home` → renders homepage
- `GET /results` → example route demonstrating AI response (uses `openai.js`)
- `/:`
  - `routes/user/user.js`: auth and user-related routes
  - `routes/dashboard/dashboard.js`: dashboard routes
  - `routes/features/feature.js`: generation endpoints (MCQ/Quiz/Flashcards/Summary)

Error handling falls back to EJS view `views/error.ejs`. Unknown routes return 404 via a centralized error handler.

## Configuration Notes
- **Sessions**: Configured with `express-session` using `SECRET`. Cookies default to 1-day lifetime and `httpOnly`.
- **Passport**: Local strategy with `passport-local-mongoose` on `models/User.js`.
- **Static assets**: Served from `public/`; uploads optionally from `/uploads` path.
- **View engine**: EJS with `ejs-mate` layouts.

## AI Providers
- `openai.js` integrates with the `openai` SDK and expects `OPENAI_API_KEY`.
- `@google/genai` is installed; if used, set `GOOGLE_API_KEY` and follow that file’s configuration.

## Cloudinary (optional)
- Configure `cloudinaryConfig.js` to initialize from your Cloudinary env vars
- Pair with `multer`/`multer-storage-cloudinary` to store uploads remotely

## Common Issues
- "Cannot connect to MongoDB": Ensure `mongod` is running locally or update `MONGODB_URI` to a valid Atlas URI.
- "Unauthorized/Session not persisting": Confirm `SECRET` is set and cookies are not blocked.
- "AI calls failing": Verify the correct API key is set and the specific provider is configured in `openai.js` or related files.

## Owner
Ankush Verma

## Acknowledgements
- OpenAI and Google GenAI SDKs
- Express and EJS community
- Cloudinary for media storage
