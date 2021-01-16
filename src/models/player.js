const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { composeWithMongoose } = require("graphql-compose-mongoose");
// const { TeamTC } = require('./team');

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    countryOfBirth: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    nationality: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
  },
  {
    collection: "players",
  }
);

PlayerSchema.plugin(timestamps);

PlayerSchema.index({ createdAt: 1, updatedAt: 1 });

const Player = mongoose.model("Player", PlayerSchema);
const PlayerTC = composeWithMongoose(Player);
// PlayerTC.addRelation(
//   'team',
//   {
//     resolver: TeamTC.getResolver("findById"),
//     prepareArgs: {
//       _id: source => source.teamId
//     },
//     projection: { teamId: true },
//   }
// )

module.exports = {
  PlayerSchema,
  Player,
  PlayerTC,
};
