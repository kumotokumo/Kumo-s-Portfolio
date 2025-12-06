#!/bin/bash

# Fix CloudBase Deployment - Deploy to Root Path

set -e

echo "🔍 Current CloudBase file structure shows files in 'Kumo-s-Portfolio/' subpath"
echo "📝 This script will deploy files directly to root path"
echo ""

echo "🧹 Step 1: Cleaning previous build..."
rm -rf dist

echo "🔨 Step 2: Building for CloudBase (root path)..."
npm run build:cloudbase

echo "✅ Step 3: Verifying build output..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found!"
    exit 1
fi

if [ ! -d "dist/assets" ]; then
    echo "❌ Error: dist/assets directory not found!"
    exit 1
fi

echo "📋 Asset files in dist:"
ls -lh dist/assets/

echo ""
echo "📄 Checking index.html asset paths..."
grep -E "(src|href)=.*assets" dist/index.html

echo ""
echo "🚀 Step 4: Deploying to CloudBase root path..."
echo "⚠️  Note: This will deploy files directly to root, not subpath"

# Deploy dist contents directly to root
cd dist
npx tcb hosting deploy . -e kumo-s-portfolio-1f7f16g4b4797a6
cd ..

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔍 Verify deployment:"
echo "   npx tcb hosting:list -e kumo-s-portfolio-1f7f16g4b4797a6 | grep -E '(index.html|assets)'"
echo ""
echo "🌐 Access your site at:"
echo "   https://kumo-s-portfolio-1f7f16g4b4797a6-1305521879.tcloudbaseapp.com"
echo ""
echo "💡 If files still show in subpath, you may need to:"
echo "   1. Delete old files in CloudBase console"
echo "   2. Or use: npx tcb hosting delete -e kumo-s-portfolio-1f7f16g4b4797a6 --path 'Kumo-s-Portfolio'"

