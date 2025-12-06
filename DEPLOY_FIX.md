# CloudBase 404 Error Fix Guide

## Problem
Resources (CSS/JS files) are returning 404 errors after deployment.

## Solution

### Step 1: Clean and Rebuild

```bash
# Clean previous build
rm -rf dist

# Rebuild with CloudBase configuration
npm run build:cloudbase
```

### Step 2: Verify Build Output

```bash
# Check that assets exist
ls -la dist/assets/

# Verify index.html references
cat dist/index.html | grep assets
```

### Step 3: Deploy to CloudBase

```bash
# Deploy using the deployment script
npm run deploy:cloudbase
```

Or manually:

```bash
npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6
```

### Step 4: Verify Deployment

After deployment, check the file list:

```bash
npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6
```

Make sure these files are listed:
- `index.html`
- `assets/index-*.css`
- `assets/index-*.js`
- `favicon/` directory
- `images/` directory (if using local images)

### Step 5: Clear Browser Cache

After redeployment:
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Or use incognito/private mode
3. Or add `?v=timestamp` to the URL

## Common Issues

### Issue 1: Files not uploaded
- **Symptom**: 404 errors for all assets
- **Solution**: Check `.tcbignore` doesn't exclude `dist/assets/`

### Issue 2: Wrong base path
- **Symptom**: Resources load from wrong path
- **Solution**: Ensure using `npm run build:cloudbase` (not `npm run build`)

### Issue 3: Cached old files
- **Symptom**: Old file names in 404 errors
- **Solution**: Rebuild and redeploy, clear browser cache

## Verification Checklist

- [ ] Build completed without errors
- [ ] `dist/assets/` directory contains CSS and JS files
- [ ] `dist/index.html` references correct asset paths
- [ ] Deployment completed successfully
- [ ] File list shows all assets in CloudBase
- [ ] Browser cache cleared
- [ ] Accessing root URL (not subpath)

