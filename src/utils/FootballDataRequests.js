require("dotenv").config();
const CONFIG = require("../config");
const {
  GetCompetitionByCode,
  GetTeamByID,
} = require("../constants/serviceURLs");
const { Fetch } = require("./Fetch");
const fetchSimpleInstance = new Fetch({
  xAuthToken: CONFIG.footballApi.token,
}).fetch;

const MAX_REQUESTS = 10;
const SLEEP_TIME = 60 * 1000;
var _internal_counter = 0;

const SLEEP = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const genericRequest = async (endpointURL, data = {}) => {
  if (_internal_counter === MAX_REQUESTS) {
    _internal_counter = 0;
    await SLEEP(SLEEP_TIME);
  }
  const responseObtained = await fetchSimpleInstance(
    CONFIG.footballApi.baseURL + endpointURL,
    data
  );
  _internal_counter += 1;
  return responseObtained;
};

const getCompetition = async (code) => {
  let response = await genericRequest(GetCompetitionByCode(code));
  const teams = response.teams;
  response = response.competition;
  response.teams = teams;
  return response;
};

const getPlayers = async (id) => {
  const response = await genericRequest(GetTeamByID(id));
  return response.squad;
};

module.exports = {
  getCompetition: getCompetition,
  getPlayers: getPlayers,
};
