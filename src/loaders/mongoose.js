const CONFIG = require("../config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

module.exports = async () => {
  const connection = await mongoose.connect(CONFIG.databaseURL, {
    autoIndex: true,
    poolSize: 50,
    bufferMaxEntries: 0,
    keepAlive: 120,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
};
