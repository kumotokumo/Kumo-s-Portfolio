#!/bin/bash

# CloudBase Deployment Script with Verification

set -e

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "🔨 Building for CloudBase..."
npm run build:cloudbase

echo "✅ Verifying build output..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found!"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    echo "❌ Error: dist/assets directory not found!"
    exit 1
fi

ASSET_COUNT=$(find dist/assets -type f | wc -l)
echo "📦 Found $ASSET_COUNT asset files"

if [ "$ASSET_COUNT" -eq 0 ]; then
    echo "❌ Error: No asset files found in dist/assets!"
    exit 1
fi

echo "📋 Asset files:"
ls -lh dist/assets/

echo ""
echo "📄 Checking index.html asset references..."
grep -E "(src|href)=.*assets" dist/index.html || echo "⚠️  Warning: No asset references found in index.html"

echo ""
echo "🚀 Deploying to CloudBase..."
npx tcb hosting deploy dist -e kumo-s-portfolio-1f7f16g4b4797a6 --overwrite

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔍 To verify deployment, run:"
echo "   npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6"
echo ""
echo "🌐 Access your site at:"
echo "   https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com"

