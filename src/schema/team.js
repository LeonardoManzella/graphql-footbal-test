const { Team, TeamTC } = require("../models/team");
const { findTeam, findManyTeam } = require("../utils/DB");

const TeamQuery = {
  teamById: TeamTC.getResolver("findById"),
  teamByIds: TeamTC.getResolver("findByIds"),
  teamOne: TeamTC.getResolver("findOne"),
  teamMany: TeamTC.getResolver("findMany"),
  teamCount: TeamTC.getResolver("count"),
  teamConnection: TeamTC.getResolver("connection"),
  teamPagination: TeamTC.getResolver("pagination"),
  team: {
    type: TeamTC,
    args: { name: "String" },
    resolve: async (source, args, context, info) => {
      return await findTeam(args.name);
    },
  },
  teams: {
    type: [TeamTC],
    args: {},
    resolve: async (source, args, context, info) => {
      return await findManyTeam();
    },
  },
};

const TeamMutation = {
  teamCreateOne: TeamTC.getResolver("createOne"),
  teamCreateMany: TeamTC.getResolver("createMany"),
  teamUpdateById: TeamTC.getResolver("updateById"),
  teamUpdateOne: TeamTC.getResolver("updateOne"),
  teamUpdateMany: TeamTC.getResolver("updateMany"),
  teamRemoveById: TeamTC.getResolver("removeById"),
  teamRemoveOne: TeamTC.getResolver("removeOne"),
  teamRemoveMany: TeamTC.getResolver("removeMany"),
};

module.exports = {
  TeamQuery,
  TeamMutation,
};
