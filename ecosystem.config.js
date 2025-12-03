module.exports = {
  apps: [{
    name: 'hemitech-finance',
    script: './server/index.ts',
    interpreter: 'tsx',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '500M',
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
