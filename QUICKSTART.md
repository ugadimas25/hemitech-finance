# Hemitech Finance - Quick Start Guide

## ✅ Status: Successfully Pushed to GitHub
Repository: https://github.com/ugadimas25/hemitech-finance.git

---

## 🚀 Quick Deployment Commands

### On your VPS Hostinger, run these commands:

```bash
# 1. Download and run setup script
wget https://raw.githubusercontent.com/ugadimas25/hemitech-finance/main/vps-setup.sh
chmod +x vps-setup.sh
sudo ./vps-setup.sh

# 2. Configure environment
cd /var/www/hemitech-finance
sudo nano .env
```

**Edit .env with your database credentials:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=pewaca_dev
DB_USERNAME=pewaca_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

NODE_ENV=production
PORT=5000
```

```bash
# 3. Setup MySQL database
sudo mysql -u root -p
```

**In MySQL prompt:**
```sql
CREATE DATABASE pewaca_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pewaca_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON pewaca_dev.* TO 'pewaca_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 4. Initialize database
npx tsx setup-db.ts
npx tsx update-revenue-data.ts

# 5. Configure Nginx
sudo nano /etc/nginx/sites-available/hemitech-finance
# Replace 'your_domain.com' with your actual domain

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 6. Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command that PM2 outputs

# 7. Check status
pm2 status
pm2 logs hemitech-finance
```

---

## 🔐 Optional: Setup SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your_domain.com -d www.your_domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Access Your Application

- **Without SSL**: http://your_domain.com
- **With SSL**: https://your_domain.com

---

## 🔄 Future Updates

```bash
cd /var/www/hemitech-finance
./deploy.sh
```

Or manually:
```bash
git pull origin main
npm install
pm2 restart hemitech-finance
```

---

## 📝 Monitoring Commands

```bash
# View logs
pm2 logs hemitech-finance

# Monitor resources
pm2 monit

# Check status
pm2 status

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Troubleshooting

### Application not starting?
```bash
pm2 logs hemitech-finance --lines 50
```

### Database connection error?
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u pewaca_user -p pewaca_dev
```

### Nginx error?
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 Support Files

- Full documentation: `DEPLOYMENT.md`
- API documentation: `API_DOCUMENTATION.md`
- Database setup: `SETUP_DATABASE.sql`

---

## 🎯 What's Deployed

✅ Full-stack React + Express application
✅ MySQL database with real financial data
✅ Interactive housing map (5 locations in Bogor)
✅ Detailed revenue breakdown with monthly accumulation
✅ CAPEX, OPEX, Employees, Revenue sections
✅ PM2 process manager for high availability
✅ Nginx reverse proxy
✅ Production-ready configuration

---

**Good luck with your deployment! 🚀**
