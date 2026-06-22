# Deployment Configuration Guide

## Full-Stack Deployment on Vercel

This is now a single full-stack application with:
- **Frontend**: React + Vite (in `/client`)
- **Backend**: Express.js (in `/server`)
- **Database**: MongoDB

### Local Development

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   - Copy `server/.env.example` → `server/.env` and fill in your values
   - Copy `client/.env.example` → `client/.env` and fill in your values

3. **Run both server and client**:
   ```bash
   npm run dev
   ```
   - Client runs on: http://localhost:5173 (Vite default)
   - Server runs on: http://localhost:5000

### Production Build

1. **Build locally**:
   ```bash
   npm run build
   ```
   This builds the React client and prepares the server to serve it.

2. **Test production build**:
   ```bash
   npm start
   ```

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Setup full-stack deployment"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - **Important**: Vercel will auto-detect the root as the project root (correct ✓)

3. **Set Environment Variables** in Vercel Dashboard:
   - `MONGO_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

4. **Build Settings** (Vercel should auto-detect):
   - Build Command: `npm run build`
   - Output Directory: (leave blank for Node.js)
   - Start Command: `npm start`

5. **Deploy** - Vercel will:
   - Build the React client
   - Package it with the server
   - Start the Express server which serves both API and static files

### Troubleshooting

- **"Cannot find dist folder"**: Run `npm run build` locally first
- **API not connecting**: Verify `VITE_API_URL` in client `.env`
- **Routes not working**: Ensure client routing is handled by the catch-all route in server.js

### Project Structure
```
/
├── client/              # React frontend (built to dist/)
├── server/              # Express backend
├── package.json         # Root monorepo package.json
├── vercel.json          # Vercel deployment config
└── .env files           # Environment variables
```
