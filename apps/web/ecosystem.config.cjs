module.exports = {
  apps: [
    {
      name: "my-doctor-web",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3002",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3002,
      },
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
