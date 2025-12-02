#!/bin/bash

# VPS Hostinger - First Time Setup Script
# Run this script on your VPS as root or with sudo

set -e  # Exit on error

echo "🚀 Hemitech Finance - VPS Setup Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Install Node.js 20.x
print_info "Installing Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Install PM2
print_info "Installing PM2..."
npm install -g pm2 tsx
print_success "PM2 installed"

# Install Nginx
print_info "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    print_success "Nginx installed and started"
else
    print_success "Nginx already installed"
fi

# Install MySQL
print_info "Installing MySQL..."
if ! command -v mysql &> /dev/null; then
    apt install -y mysql-server
    print_success "MySQL installed"
    print_info "Run 'mysql_secure_installation' to secure MySQL"
else
    print_success "MySQL already installed"
fi

# Install Git
print_info "Installing Git..."
if ! command -v git &> /dev/null; then
    apt install -y git
    print_success "Git installed"
else
    print_success "Git already installed"
fi

# Create application directory
print_info "Creating application directory..."
mkdir -p /var/www
cd /var/www

# Clone repository
print_info "Cloning repository from GitHub..."
if [ -d "hemitech-finance" ]; then
    print_info "Repository already exists, pulling latest changes..."
    cd hemitech-finance
    git pull origin main
else
    git clone https://github.com/ugadimas25/hemitech-finance.git
    cd hemitech-finance
    print_success "Repository cloned"
fi

# Install dependencies
print_info "Installing Node.js dependencies..."
npm install
print_success "Dependencies installed"

# Create logs directory
mkdir -p logs

# Setup environment file
print_info "Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_info "Please edit .env file with your database credentials:"
    print_info "nano .env"
else
    print_success ".env file already exists"
fi

# Configure Nginx
print_info "Configuring Nginx..."
if [ ! -f "/etc/nginx/sites-available/hemitech-finance" ]; then
    cp nginx.conf /etc/nginx/sites-available/hemitech-finance
    ln -s /etc/nginx/sites-available/hemitech-finance /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    print_info "Please edit Nginx config with your domain:"
    print_info "nano /etc/nginx/sites-available/hemitech-finance"
    print_info "Replace 'your_domain.com' with your actual domain"
else
    print_success "Nginx config already exists"
fi

# Test Nginx configuration
nginx -t && systemctl restart nginx
print_success "Nginx configured and restarted"

# Configure firewall
print_info "Configuring firewall..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable
print_success "Firewall configured"

# Make deploy script executable
chmod +x deploy.sh

echo ""
echo "========================================"
print_success "Initial setup completed!"
echo "========================================"
echo ""
print_info "Next steps:"
echo "1. Edit .env file: nano /var/www/hemitech-finance/.env"
echo "2. Setup MySQL database:"
echo "   - mysql -u root -p"
echo "   - CREATE DATABASE pewaca_dev;"
echo "   - CREATE USER 'pewaca_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "   - GRANT ALL PRIVILEGES ON pewaca_dev.* TO 'pewaca_user'@'localhost';"
echo "   - FLUSH PRIVILEGES;"
echo "   - EXIT;"
echo "3. Run database setup: npx tsx setup-db.ts"
echo "4. Run data migration: npx tsx update-revenue-data.ts"
echo "5. Edit Nginx config: nano /etc/nginx/sites-available/hemitech-finance"
echo "6. Start application: pm2 start ecosystem.config.js"
echo "7. Save PM2 config: pm2 save"
echo "8. Setup PM2 startup: pm2 startup (then run the command it outputs)"
echo "9. (Optional) Setup SSL: certbot --nginx -d your_domain.com"
echo ""
