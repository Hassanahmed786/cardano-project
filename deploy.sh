#!/bin/bash
# Deploy Cardano Gift Card to Vercel
# Run this script to deploy your project

echo "🚀 Deploying Cardano Gift Card dApp..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Prepare for deployment - $(date)"
fi

echo "✅ Project ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to vercel.com and import your repository"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy and test!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"