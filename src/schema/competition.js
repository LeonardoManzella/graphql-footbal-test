const { Competition, CompetitionTC } = require("../models/competition");
const { PlayerTC } = require("../models/player");
const {
  findCompetition,
  findManyCompetition,
  populateTeams,
  populatePlayers,
  importLeagueData,
} = require("../utils/DB");

const CompetitionQuery = {
  competitonById: CompetitionTC.getResolver("findById"),
  competitonByIds: CompetitionTC.getResolver("findByIds"),
  competitonOne: CompetitionTC.getResolver("findOne"),
  competitonMany: CompetitionTC.getResolver("findMany"),
  competitonCount: CompetitionTC.getResolver("count"),
  competitonConnection: CompetitionTC.getResolver("connection"),
  competitonPagination: CompetitionTC.getResolver("pagination"),
  competition: {
    type: CompetitionTC,
    args: { name: "String" },
    resolve: async (source, args, context, info) => {
      return await findCompetition(args.name);
    },
  },
  competitions: {
    type: [CompetitionTC],
    args: {},
    resolve: async (source, args, context, info) => {
      return await findManyCompetition();
    },
  },
  players: {
    type: [PlayerTC],
    args: { leagueCode: "String", teamName: "String" },
    resolve: async (source, args, context, info) => {
      const ONLY = 0;
      let teamsIds = await findManyCompetition({ code: args.leagueCode });
      if (!teamsIds.length)
        throw new Error(
          `The league '${args.leagueCode}' is not present in the DB`
        );

      teamsIds = teamsIds[ONLY].teamsIds;
      let teams = await populateTeams(teamsIds);
      if (args.teamName) {
        teams = teams.filter((team) => team.name === args.teamName);
      }
      let players = [];
      for (let current = 0; current < teams.length; current++) {
        const team = teams[current];
        players.push(...(await populatePlayers(team.playerIds)));
      }
      return players;
    },
  },
};

const CompetitionMutation = {
  competitonCreateOne: CompetitionTC.getResolver("createOne"),
  competitonCreateMany: CompetitionTC.getResolver("createMany"),
  competitonUpdateById: CompetitionTC.getResolver("updateById"),
  competitonUpdateOne: CompetitionTC.getResolver("updateOne"),
  competitonUpdateMany: CompetitionTC.getResolver("updateMany"),
  competitonRemoveById: CompetitionTC.getResolver("removeById"),
  competitonRemoveOne: CompetitionTC.getResolver("removeOne"),
  competitonRemoveMany: CompetitionTC.getResolver("removeMany"),
  importLeague: {
    type: [CompetitionTC],
    args: { leagueCode: "String" },
    resolve: async (source, args, context, info) => {
      await importLeagueData(args.leagueCode);
      return await findManyCompetition({ code: args.leagueCode });
    },
  },
};

module.exports = {
  CompetitionQuery,
  CompetitionMutation,
};
