# Hemitech Finance - Deployment Guide

## 🚀 Production Deployment to VPS Hostinger

### Prerequisites
- VPS with Ubuntu/Debian
- Node.js 20.x installed
- MySQL database
- Domain name pointed to VPS IP
- Git installed
- PM2 installed globally: `npm install -g pm2`
- Nginx installed

---

## 📋 Step-by-Step Deployment

### 1️⃣ Push to GitHub

```bash
# Initialize git repository (if not already done)
cd D:\b_outside\pewaca\Finance_R1\CashflowPredict\CashflowPredict
git init

# Add remote repository
git remote add origin https://github.com/ugadimas25/hemitech-finance.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Hemitech Finance Dashboard"

# Push to main branch
git push -u origin main
```

---

### 2️⃣ Setup VPS Hostinger

#### A. Connect to VPS
```bash
ssh root@your_vps_ip
```

#### B. Install Node.js 20.x
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### C. Install PM2
```bash
sudo npm install -g pm2
sudo npm install -g tsx
```

#### D. Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### E. Install MySQL (if not installed)
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

---

### 3️⃣ Clone Repository on VPS

```bash
# Create directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/ugadimas25/hemitech-finance.git
cd hemitech-finance

# Install dependencies
npm install
```

---

### 4️⃣ Configure Environment

```bash
# Create .env file
sudo nano .env
```

Add your production database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=pewaca_dev
DB_USERNAME=pewaca_user
DB_PASSWORD=your_secure_password

NODE_ENV=production
PORT=5000
```

---

### 5️⃣ Setup Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE pewaca_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pewaca_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pewaca_dev.* TO 'pewaca_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run database migrations
npx tsx setup-db.ts
npx tsx update-revenue-data.ts
```

---

### 6️⃣ Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/hemitech-finance

# Edit the configuration
sudo nano /etc/nginx/sites-available/hemitech-finance
```

**Update these values:**
- Replace `your_domain.com` with your actual domain
- Update paths if different

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hemitech-finance /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

### 7️⃣ Start Application with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs hemitech-finance
```

---

### 8️⃣ Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your_domain.com -d www.your_domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### 9️⃣ Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔄 Updating Deployment

For future updates, use the deployment script:

```bash
# On VPS
cd /var/www/hemitech-finance
chmod +x deploy.sh
./deploy.sh
```

Or manually:
```bash
git pull origin main
npm install
pm2 restart hemitech-finance
```

---

## 📊 Monitoring & Logs

```bash
# View application logs
pm2 logs hemitech-finance

# Monitor resources
pm2 monit

# Check status
pm2 status

# View nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🛠️ Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs hemitech-finance --lines 100

# Check if port 5000 is available
sudo netstat -tulpn | grep 5000

# Restart application
pm2 restart hemitech-finance
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### Database connection issues
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u pewaca_user -p pewaca_dev
```

---

## 📱 Access Your Application

After deployment:
- **HTTP**: http://your_domain.com
- **HTTPS** (after SSL): https://your_domain.com

---

## 🔐 Security Recommendations

1. **Change default passwords**
2. **Enable firewall** (ufw)
3. **Setup SSL certificate** (Let's Encrypt)
4. **Regular updates**: `sudo apt update && sudo apt upgrade`
5. **Backup database regularly**
6. **Use strong database passwords**
7. **Keep .env file secure** (never commit to git)

---

## 📞 Support

For issues or questions, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs: `logs/` directory

---

## 📝 Quick Commands Reference

```bash
# Application
pm2 start ecosystem.config.js    # Start app
pm2 restart hemitech-finance      # Restart app
pm2 stop hemitech-finance         # Stop app
pm2 logs hemitech-finance         # View logs

# Nginx
sudo systemctl restart nginx      # Restart nginx
sudo nginx -t                     # Test config

# Database
mysql -u pewaca_user -p pewaca_dev  # Connect to DB

# Updates
git pull origin main              # Pull updates
npm install                       # Install deps
pm2 restart hemitech-finance      # Restart app
```
