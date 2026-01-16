# 🚀 Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway.app (Recommended - Easiest)

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select repo**: Choose `BackEndCyper43`
4. **Add MongoDB (Bắt buộc)**:
   - Click nút **"New"** (hoặc chuột phải vào khoảng trống)
   - Chọn **Database** → **MongoDB**
   - Đợi service khởi tạo xong (màu xanh).
5. **Connect Database**:
   - Click vào service **MongoDB** → Tab **Connect** → Copy **Connection URL**.
   - Click vào service **Backend** → Tab **Variables** → New Variable.
   - Name: `MONGO_URI`, Value: (Dán link vừa copy).
6. **Environment Variables**: Add thêm các biến sau vào tab Variables của Backend:
   ```
   JWT_SECRET=nhap_gi_cung_duoc_bi_mat
   JWT_REFRESH_SECRET=nhap_gi_cung_duoc_khac
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```
7. **Deploy**: Railway will auto-deploy! 🎉

**Cost**: Free tier includes $5/month credit

---

### Option 2: Render.com

1. **Sign up**: [render.com](https://render.com)
2. **New Web Service**: Dashboard → "New" → "Web Service"
3. **Connect repo**: Choose `BackEndCyper43`
4. **Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Add MongoDB**: "New" → "MongoDB" (or use MongoDB Atlas)
6. **Environment Variables**: Same as Railway
7. **Create Web Service**

**Cost**: Free tier available (spins down after inactivity)

---

### Option 3: Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create app**:
   ```bash
   cd BackEndCyper43
   heroku create cypher43-backend
   ```

4. **Add MongoDB**:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
   heroku config:set EMAIL_USER=your-email
   heroku config:set EMAIL_PASS=your-password
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

**Cost**: Free tier available (limited hours)

---

### Option 4: DigitalOcean App Platform

1. **Sign up**: [digitalocean.com](https://www.digitalocean.com/products/app-platform)
2. **Create App**: Connect GitHub repo
3. **Configure**:
   - **Type**: Web Service
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
4. **Add MongoDB**: Use managed MongoDB or MongoDB Atlas
5. **Environment Variables**: Add in dashboard
6. **Deploy**

**Cost**: Starts at $5/month

---

## CI/CD Setup

### GitHub Actions (Already configured!)

Every time you push to `main` or `master`:
1. ✅ Code is tested
2. ✅ Docker image is built
3. ✅ Ready for deployment

### Manual Deployment

If you prefer manual deployment:

```bash
# Build Docker image
docker build -t cypher43-backend .

# Run locally
docker run -p 3000:3000 --env-file .env cypher43-backend

# Push to Docker Hub (optional)
docker tag cypher43-backend yourusername/cypher43-backend
docker push yourusername/cypher43-backend
```

---

## Environment Variables Checklist

Make sure to set these on your deployment platform:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret for access tokens
- [ ] `JWT_REFRESH_SECRET` - Secret for refresh tokens
- [ ] `EMAIL_USER` - Email for sending notifications
- [ ] `EMAIL_PASS` - Email app password
- [ ] `PORT` - Port number (usually 3000)
- [ ] `NODE_ENV` - Set to `production`

---

## Health Check Endpoint

Add this to your `index.js` for health monitoring:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
```

---

## Monitoring

After deployment, monitor your app:
- Railway: Built-in metrics dashboard
- Render: Logs and metrics in dashboard
- Heroku: `heroku logs --tail`

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Heroku Docs: https://devcenter.heroku.com
