const { PlayerSchema, Player, PlayerTC } = require("../models/player");

const PlayerQuery = {
  playerById: PlayerTC.getResolver("findById"),
  playerByIds: PlayerTC.getResolver("findByIds"),
  playerOne: PlayerTC.getResolver("findOne"),
  playerMany: PlayerTC.getResolver("findMany"),
  playerCount: PlayerTC.getResolver("count"),
  playerConnection: PlayerTC.getResolver("connection"),
  playerPagination: PlayerTC.getResolver("pagination"),
};

const PlayerMutation = {
  playerCreateOne: PlayerTC.getResolver("createOne"),
  playerCreateMany: PlayerTC.getResolver("createMany"),
  playerUpdateById: PlayerTC.getResolver("updateById"),
  playerUpdateOne: PlayerTC.getResolver("updateOne"),
  playerUpdateMany: PlayerTC.getResolver("updateMany"),
  playerRemoveById: PlayerTC.getResolver("removeById"),
  playerRemoveOne: PlayerTC.getResolver("removeOne"),
  playerRemoveMany: PlayerTC.getResolver("removeMany"),
};

module.exports = {
  PlayerQuery,
  PlayerMutation,
};
