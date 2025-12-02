#!/bin/bash

# Hemitech Finance - Production Deployment Script
# This script should be run on your VPS

echo "🚀 Starting Hemitech Finance deployment..."

# Navigate to project directory
cd /var/www/hemitech-finance || exit

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application (if needed)
echo "🔨 Building application..."
# Uncomment if you have a build step
# npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart PM2 process
echo "🔄 Restarting application with PM2..."
pm2 restart ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Check application status: pm2 status"
echo "📝 View logs: pm2 logs hemitech-finance"
