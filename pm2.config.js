module.exports = {
  apps: [
    {
      name: "app1",
      script: "./index.js",
      watch: false,
      env: {
        "NODE_ENV": "development",
        "PORT": 30000
      },
      env_production: {
        "NODE_ENV": "production",
        "PORT": 30000
      }
    }
  ]
}