#!/bin/bash

echo "🎂 Birthday Book - Test Script"
echo "================================"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Running npm install..."
    npm install
fi

# Check if dist folder exists
if [ -d "dist" ]; then
    echo "✅ Build folder exists"
else
    echo "⚠️  Build folder not found. Running build..."
    npm run build
fi

echo ""
echo "📋 Project Structure:"
echo "--------------------"
ls -la

echo ""
echo "📦 Package Info:"
echo "---------------"
cat package.json | grep -E '"name"|"version"'

echo ""
echo "🚀 Available Commands:"
echo "---------------------"
echo "npm run dev      - Start development server (http://localhost:5173)"
echo "npm run build    - Build for production"
echo "npm run preview  - Preview production build (http://localhost:4173)"

echo ""
echo "✨ Project is ready to use!"
echo ""
echo "To start development server: npm run dev"
echo "To build for production: npm run build"