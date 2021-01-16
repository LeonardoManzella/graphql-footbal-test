const routes = require("../api");
const config = require("../config");
const logger = require("./logger");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

module.exports = (app) => {
  app.use(cors());

  /**
   * Health Check endpoints
   */
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });
  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/favicon.ico"));
  });

  // --> Setting
  app.set("json spaces", 2);

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require("method-override")());

  // --> Middleware
  app.use(morgan("combined", { stream: logger.stream }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Load API routes
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    err.code = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    logger.error(
      `${code} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    logger.error("Error %o", err.stack);
    res.status(code);
    let body = {
      error: {
        code: code,
        message: err.message,
      },
    };
    if (err.payload) {
      body.payload = err.payload;
    }
    res.json(body);
  });
};
