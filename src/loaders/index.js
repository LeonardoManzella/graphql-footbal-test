const expressLoader = require("./express");
const events = require("./events");
const mongooseLoader = require("./mongoose");
const apolloLoader = require("./apollo");
const logger = require("./logger");

module.exports = async (app) => {
  events.once("api-started", () => logger.info("✌️  EventEmitter loaded!"));
  events.emit("api-started");

  const mongoConnection = await mongooseLoader();
  logger.info("✌️  DB loaded and connected!");
  events.emit("db-connected", mongoConnection);

  await apolloLoader(app);
  logger.info("✌️  Apollo GraphQL server loaded and ready!");

  await expressLoader(app);
  logger.info("✌️  Express loaded!");
};
