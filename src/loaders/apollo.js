const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const schema = require("../schema");
// const DB = require('../loaders/mongoose');

module.exports = async (app) => {
  const server = new ApolloServer({
    schema,
    cors: true,
    playground: process.env.NODE_ENV === "development" ? true : false,
    introspection: true,
    tracing: true,
    path: "/",
  });

  return server.applyMiddleware({
    app,
    path: "/",
    cors: true,
    onHealthCheck: () =>
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
          resolve();
        } else {
          reject();
        }
      }),
  });
};
