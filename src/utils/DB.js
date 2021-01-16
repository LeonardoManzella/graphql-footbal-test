const logger = require("../loaders/logger");
const { Competition } = require("../models/competition");
const { Team } = require("../models/team");
const { Player } = require("../models/player");
const { getCompetition, getPlayers } = require("./FootballDataRequests");

const findModel = async (MODEL, name, id) => {
  let filters = {};
  if (name) filters.name = name;
  if (id) filters["_id"] = id;
  const elementFound = await MODEL.findOne(filters);
  logger.silly(
    `utils/mongoose/findModel found ${MODEL.collection.name}: ${
      elementFound && elementFound.name
    }`
  );
  return elementFound;
};

const findManyModel = async (MODEL, filters) => {
  const elementsFound = await MODEL.find(filters);
  logger.silly(
    `utils/mongoose/findManyModel found ${MODEL.collection.name}: totalling ${
      (elementsFound && elementsFound.length) || 0
    } elements`
  );
  return elementsFound;
};

const saveUpdateModel = async (MODEL, name, data, keys) => {
  let elementToUpdate = await findModel(MODEL, name);
  if (!elementToUpdate) {
    logger.silly(
      `utils/mongoose/saveUpdateModel Creating new ${MODEL.collection.name}`
    );
    elementToUpdate = new MODEL();
  }
  elementToUpdate.name = name;
  keys.forEach((key) => {
    elementToUpdate[key] = data[key];
  });
  await elementToUpdate.save();
  logger.silly(`utils/mongoose/saveUpdateModel ${MODEL.collection.name} saved`);
  return await findModel(MODEL, name);
};

module.exports.findCompetition = async (name) => {
  return await findModel(Competition, name);
};

module.exports.findManyCompetition = async (filters) => {
  return await findManyModel(Competition, filters);
};

const saveUpdateCompetition = async (name, data) => {
  return await saveUpdateModel(Competition, name, data, [
    "code",
    "areaName",
    "teamsIds",
  ]);
};
module.exports.saveUpdateCompetition = saveUpdateCompetition;

const findTeamById = async (id) => {
  return await findModel(Team, null, id);
};
module.exports.findTeamById = findTeamById;

const findTeam = async (name) => {
  return await findModel(Team, name);
};
module.exports.findTeam = findTeam;

module.exports.findManyTeam = async (filters) => {
  return await findManyModel(Team, filters);
};

const saveUpdateTeam = async (name, data) => {
  return await saveUpdateModel(Team, name, data, [
    "tla",
    "shortName",
    "areaName",
    "email",
    "playerIds",
  ]);
};
module.exports.saveUpdateTeam = saveUpdateTeam;

module.exports.populateTeams = async (teamsIds) => {
  let teams = [];
  for (let current = 0; current < teamsIds.length; current++) {
    const teamId = teamsIds[current];
    teams.push(await findTeamById(teamId));
  }
  return teams;
};

const findPlayerById = async (id) => {
  return await findModel(Player, null, id);
};
module.exports.findPlayerById = findPlayerById;

const findPlayer = async (name) => {
  return await findModel(Player, name);
};
module.exports.findPlayer = findPlayer;

const saveUpdatePlayer = async (name, data) => {
  return await saveUpdateModel(Player, name, data, [
    "position",
    "dateOfBirth",
    "countryOfBirth",
    "nationality",
  ]);
};
module.exports.saveUpdatePlayer = saveUpdatePlayer;

module.exports.populatePlayers = async (playersIds) => {
  let players = [];
  for (let current = 0; current < playersIds.length; current++) {
    const playerId = playersIds[current];
    players.push(await findPlayerById(playerId));
  }
  return players;
};

module.exports.importLeagueData = async (leagueCode) => {
  let leagueData = await getCompetition(leagueCode);
  leagueData.areaName = leagueData.area.name;
  leagueData.teamsIds = [];
  await importTeamData(leagueData);
  await saveUpdateCompetition(leagueData.name, leagueData);
};

const importTeamData = async (leagueData) => {
  for (let current = 0; current < leagueData.teams.length; current++) {
    let team = leagueData.teams[current];
    const teamFound = await findTeam(team.name);
    if (teamFound) {
      leagueData.teamsIds.push(teamFound._id);
      continue; //Don't process
    }
    team.areaName = team.area.name;
    team.playerIds = [];
    await importPlayerData(team);
    team = await saveUpdateTeam(team.name, team);
    leagueData.teamsIds.push(team._id);
  }
};

const importPlayerData = async (teamData) => {
  const players = await getPlayers(teamData.id);

  for (let current = 0; current < players.length; current++) {
    let player = players[current];
    const playerFound = await findPlayer(player.name);
    if (playerFound) {
      teamData.playerIds.push(playerFound._id);
      continue; //Don't process
    }
    player = await saveUpdatePlayer(player.name, player);
    teamData.playerIds.push(player._id);
  }
};
