module.exports = {
  apps: [
    {
      name: 'my-doctor-backend',
      script: './dist/app.js',
      instances: 'max', // Utilizing all available CPU cores
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 6089, // Make sure this matches the port you configured in Nginx and your frontend
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 6089,
      },
    },
  ],
};
