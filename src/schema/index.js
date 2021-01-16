const { SchemaComposer } = require("graphql-compose");

// const DB = require('../loaders/mongoose')

const schemaComposer = new SchemaComposer();

const { PlayerQuery, PlayerMutation } = require("./player");
const { TeamQuery, TeamMutation } = require("./team");
const { CompetitionQuery, CompetitionMutation } = require("./competition");

schemaComposer.Query.addFields({
  ...PlayerQuery,
  ...TeamQuery,
  ...CompetitionQuery,
});

schemaComposer.Mutation.addFields({
  ...PlayerMutation,
  ...TeamMutation,
  ...CompetitionMutation,
});

module.exports = schemaComposer.buildSchema();
