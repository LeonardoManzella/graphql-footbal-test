const config = require("./config");
const express = require("express");
const logger = require("./loaders/logger");

async function startServer() {
  const app = express();

  await require("./loaders")(app);

  app.listen(config.port, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info(`
          ################################################
          🛡️  Environment: ${process.env.NODE_ENV} 🛡️
          🛡️  Server listening on port: ${config.port} 🛡️ 
          ################################################
        `);
    logger.info(
      `😷 Health checks available at http://localhost:${config.port}/status`
    );
  });
}

startServer();
