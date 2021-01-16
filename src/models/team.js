const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const { PlayerTC } = require("./player");

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    tla: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    shortName: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    areaName: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    playerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  {
    collection: "teams",
  }
);

TeamSchema.plugin(timestamps);

TeamSchema.index({ createdAt: 1, updatedAt: 1 });

const Team = mongoose.model("Team", TeamSchema);
const TeamTC = composeWithMongoose(Team);
TeamTC.addRelation("players", {
  resolver: PlayerTC.getResolver("findMany"),
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        _id: {
          in: source.playerIds || [],
        },
      },
    }),
  },
  projection: { playerIds: true },
});

module.exports = {
  TeamSchema,
  Team,
  TeamTC,
};
