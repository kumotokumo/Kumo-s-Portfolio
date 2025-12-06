# CloudBase Static Website Hosting Deployment Guide

## Prerequisites

1. CloudBase CLI installed (already installed as project dependency)
2. Tencent Cloud CloudBase static website hosting service enabled
3. Environment ID: `kumo-s-portfolio-1f7f16g4b4797a6`
4. Default domain: `kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com`

## Initial Deployment Steps

### 1. Login to CloudBase

```bash
npx tcb login
```

Follow the prompts to complete login authorization in your browser.

### 2. Initialize Environment (if needed)

```bash
npx tcb env:list
```

If the environment doesn't exist, you need to create it in the Tencent Cloud console first.

### 3. Build the Project

**For CloudBase deployment, use the CloudBase-specific build command:**

```bash
npm run build:cloudbase
```

Or use the deployment script which includes building:

```bash
npm run deploy:cloudbase
```

**Note:** The `build:cloudbase` command ensures the base path is set to `/` (root) for CloudBase deployment, which is different from GitHub Pages.

Build output will be generated in the `dist/` directory.

### 4. Deploy to CloudBase

**Method 1: Using deployment script (recommended)**

```bash
npm run deploy:cloudbase
```

This command will:
1. Build the project with the correct base path for CloudBase
2. Deploy the `dist/` directory to CloudBase

**Method 2: Manual deployment**

```bash
npm run build:cloudbase
npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6
```

## Configuration Files

- `cloudbase.json`: CloudBase configuration file, specifies environment ID and build output directory
- `.tcbignore`: Files and directories to ignore during deployment, avoiding unnecessary uploads

## Important Notes

1. **Base Path**: The project is configured to use root path `/`, suitable for CloudBase deployment
2. **Image Resources**: The project uses Tencent Cloud COS for image storage, ensure COS configuration is correct
3. **Environment Variables**: If you need to use environment variables, configure them in the CloudBase console

## Subsequent Updates

After each update, simply run:

```bash
npm run deploy:cloudbase
```

This will automatically build and deploy the latest version.

## Check Deployment Status

```bash
npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6
```

## Access the Website

After successful deployment, you can access the website via:

- **Default domain (root path)**: https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com
- **Custom domain**: Available after configuring custom domain in CloudBase console

**Important:** The website is deployed to the root path `/`, not a subpath. If you see a blank page, make sure:
1. You're accessing the root URL (without `/Kumo-s-Portfolio` subpath)
2. The build was done with `npm run build:cloudbase` (not `npm run build`)
3. Check browser console for any 404 errors on assets

## Troubleshooting

### 404 Error: NoSuchKey - index.html

If you encounter a 404 error indicating that `index.html` cannot be found, follow these steps:

1. **Verify Build Output**
   ```bash
   npm run build
   ls -la dist/index.html
   ```
   Ensure the `dist/index.html` file exists.

2. **Check Deployment Command**
   Make sure you're using the correct environment ID:
   ```bash
   npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6
   ```

3. **Verify File Upload**
   Check the file list after deployment:
   ```bash
   npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6
   ```

4. **Check CloudBase Console**
   - Login to [Tencent Cloud CloudBase Console](https://console.cloud.tencent.com/tcb)
   - Navigate to Static Website Hosting page
   - Check the file list to confirm `index.html` has been uploaded
   - Check if the default index page is configured as `index.html`

5. **Redeploy**
   If files were not uploaded correctly, try:
   ```bash
   # Clean and rebuild
   rm -rf dist
   npm run build
   
   # Redeploy
   npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6
   ```

6. **Check Static Website Hosting Configuration**
   In the CloudBase console's static website hosting settings:
   - Confirm static website hosting is enabled
   - Confirm default index page is set to `index.html`
   - Confirm error page configuration (optional, recommended to set as `404.html`)

### Clear Cache

If old content is still displayed after deployment:
- Clear browser cache
- Use incognito/private mode to access
- Add `?v=timestamp` to the URL to force refresh
