<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. (Optional) Configure Tencent Cloud COS for images:
   - Create a `.env.local` file in the root directory
   - Add your Tencent Cloud COS bucket URL:
     ```
     VITE_COS_BASE_URL=https://your-bucket-name.cos.ap-region.myqcloud.com
     ```
   - If not configured, the app will use local images from the `public/images` folder
4. Run the app:
   `npm run dev`

## Image Storage Configuration

This project supports using Tencent Cloud COS (Cloud Object Storage) for hosting images.

### Setup Tencent Cloud COS

1. **Upload images to your COS bucket:**
   - Maintain the same folder structure as in `public/images/`
   - Example: `images/projects/CLACKYAI/cover.jpg` should be uploaded to your bucket at the same path

2. **Configure the COS URL:**
   - Create a `.env.local` file (or `.env`) in the project root
   - Add your COS bucket URL:
     ```
     VITE_COS_BASE_URL=https://your-bucket-name.cos.ap-region.myqcloud.com
     ```
   - Replace `your-bucket-name` and `ap-region` with your actual bucket name and region

3. **Image path conversion:**
   - The app automatically converts local paths (e.g., `/images/projects/CLACKYAI/cover.jpg`) to COS URLs
   - If `VITE_COS_BASE_URL` is not set, it falls back to local images
   - Base64 data URLs and full HTTP/HTTPS URLs are used as-is

### Example COS URL Format
```
https://portfolio-images-1234567890.cos.ap-beijing.myqcloud.com/images/projects/CLACKYAI/cover.jpg
```
