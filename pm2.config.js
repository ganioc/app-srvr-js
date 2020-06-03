module.exports = {
  apps: [
    {
      name: "app1",
      script: "./index.js",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      watch: false,
      env: {
        "NODE_ENV": "development",
        "PORT": 30000,
        "LOG_LEVEL": 'debug'
      },
      env_production: {
        "NODE_ENV": "production",
        "PORT": 30000,
        "LOG_LEVEL": 'info'
      }
    }
  ]
}