# Full-Stack Vercel Deployment Setup Checklist

## ✅ What's Been Done

### Root Level
- [x] Updated `package.json` with:
  - Build script that builds the client
  - Dev script that runs both server and client concurrently
  - Start script for production
  - Engine specification for Node 18.x

- [x] Created `vercel.json` with:
  - Correct build configuration for Node.js
  - Routes configuration for API and static files
  - Environment variable references

### Server Side (`/server`)
- [x] Updated `server.js` to:
  - Serve static files from `client/dist` folder
  - Handle SPA routing by serving `index.html` for non-API routes
  - Properly configure CORS for frontend

- [x] Created `.env.example` with required variables:
  - MONGO_URL
  - JWT_SECRET
  - PORT

### Client Side (`/client`)
- [x] Updated `.env` to use relative API path `/api`:
  - Works for both development and production

- [x] Created `.env.example` for reference

### Documentation
- [x] Created `DEPLOYMENT.md` with complete deployment guide

---

## 🚀 Next Steps to Deploy

### 1. Local Testing
```bash
# Install all dependencies
npm run install-all

# Create server/.env with your values
# Example:
# MONGO_URL=mongodb+srv://...
# JWT_SECRET=your_secret_here

# Run development
npm run dev
```

### 2. Build Test
```bash
# Build everything
npm run build

# Start production server
npm start
# Visit http://localhost:5000
```

### 3. Push to GitHub
```bash
git add .
git commit -m "Setup full-stack Vercel deployment"
git push origin main
```

### 4. Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. **Important Settings**:
   - Root Directory: `.` (root of repository)
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: (blank)
   - Install Command: `npm install` (or use the install-all script manually if needed)
5. Add Environment Variables:
   - `MONGO_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret
6. Click Deploy

### 5. Verify Deployment
- Frontend loads at: `https://your-vercel-url.vercel.app`
- API accessible at: `https://your-vercel-url.vercel.app/api/*`
- Database connection working
- All routes functioning

---

## 📝 Important Notes

### Structure
- Client builds to `client/dist/`
- Server reads from `client/dist/` in production
- All API routes are prefixed with `/api/`
- Non-API routes served as SPA (single-page app)

### Environment Variables
- **Development**: Each folder has its own `.env`
- **Production (Vercel)**: Set in Vercel Dashboard, applies to entire app

### Monorepo Pattern
- Root `package.json` orchestrates both folders
- Each subfolder maintains its own dependencies
- Single `npm run build` builds everything
- Single `npm start` runs the entire stack

---

## ⚙️ Configuration Files Created/Modified

```
📁 Root
├── package.json (MODIFIED)
├── vercel.json (CREATED)
├── DEPLOYMENT.md (CREATED - this guide)
│
├── 📁 client
│   ├── .env (MODIFIED - now uses /api)
│   ├── .env.example (CREATED)
│   └── vite.config.ts (no changes needed ✓)
│
└── 📁 server
    ├── server.js (MODIFIED - serves client dist)
    ├── package.json (no changes needed ✓)
    ├── .env.example (CREATED)
    └── vercel.json (already had one, root vercel.json takes precedence)
```

---

## 🔗 Quick Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/nodejs)
- [React + Vite Deployment](https://vitejs.dev/guide/deployment.html)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with "Cannot find dist" | Run `npm run build` locally first to verify it works |
| API returns 404 | Ensure API routes are prefixed with `/api/` in server.js |
| Frontend shows "cannot connect to API" | Check `VITE_API_URL` in client/.env is `/api` |
| Environment variables not loading | Set them in Vercel Dashboard, not in code |
| CORS errors | Check server.js has `app.use(cors())` |
| MongoDB connection fails | Verify `MONGO_URL` is correct and IP is whitelisted |

