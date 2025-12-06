# Fix 403 Error on CloudBase

## Problem
Getting 403 error with strange URL path: `/Kumo-s-Portfolio/?/&/`

## Root Cause
This is likely caused by:
1. **Browser cache**: Old JavaScript files cached with incorrect BASE_URL
2. **Path concatenation issue**: Old code trying to access resources with wrong base path

## Solution

### Step 1: Clear Browser Cache
**IMPORTANT**: Clear your browser cache completely:

1. **Chrome/Edge**:
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Time range: "All time"
   - Click "Clear data"

2. **Firefox**:
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cache"
   - Time range: "Everything"
   - Click "Clear Now"

3. **Safari**:
   - Press `Cmd+Option+E` to clear cache
   - Or: Safari → Preferences → Advanced → Check "Show Develop menu"
   - Then: Develop → Empty Caches

### Step 2: Hard Refresh
After clearing cache, do a hard refresh:
- **Windows**: `Ctrl+F5` or `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

### Step 3: Use Incognito/Private Mode
Test in incognito/private mode to bypass cache:
- **Chrome/Edge**: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- **Firefox**: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- **Safari**: `Cmd+Shift+N`

### Step 4: Verify Deployment
Check that latest files are deployed:

```bash
npm run deploy:cloudbase
```

Then verify files in CloudBase:

```bash
npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6 | grep -E "(index.html|assets/index)"
```

Should see:
- `index.html` (latest version)
- `assets/index-*.js` (latest hash, e.g., `index-DfuGRcVp.js`)
- `assets/index-*.css` (latest hash)

### Step 5: Check File Access
Try accessing files directly:
- HTML: https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com/
- JS: https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com/assets/index-DfuGRcVp.js
- CSS: https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com/assets/index-Blfa0Ere.css

If these return 200 OK, the files are correct. The 403 error is likely from browser cache.

## Prevention

To prevent this issue:
1. Always use `npm run build:cloudbase` (not `npm run build`) for CloudBase deployment
2. Clear browser cache after each deployment
3. Use versioned file names (already implemented with hash-based naming)

## If Problem Persists

1. **Check CloudBase Console**:
   - Login to [Tencent Cloud CloudBase Console](https://console.cloud.tencent.com/tcb)
   - Check file list in Static Website Hosting
   - Verify files are in root path (not `Kumo-s-Portfolio/` subpath)

2. **Delete Old Files**:
   - In CloudBase console, delete any files in `Kumo-s-Portfolio/` directory
   - Re-deploy: `npm run deploy:cloudbase`

3. **Check Network Tab**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Check which files are returning 403
   - Verify the actual URL being requested

