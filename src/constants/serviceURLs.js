const querystring = require("querystring");

module.exports = {
  GetCompetitionByCode: (code) => `/competitions/${code}/teams`,
  GetTeamByID: (id) => `/teams/${id}`,
};
