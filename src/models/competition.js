const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const { TeamTC } = require("./team");

const CompetitionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    code: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    areaName: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    teamsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  {
    collection: "competitions",
  }
);

CompetitionSchema.plugin(timestamps);

CompetitionSchema.index({ createdAt: 1, updatedAt: 1 });

const Competition = mongoose.model("Competition", CompetitionSchema);
const CompetitionTC = composeWithMongoose(Competition);
CompetitionTC.addRelation("teams", {
  resolver: TeamTC.getResolver("findMany"),
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        _id: {
          in: source.teamsIds || [],
        },
      },
    }),
  },
  projection: { teamsIds: true },
});

module.exports = {
  CompetitionSchema,
  Competition,
  CompetitionTC,
};
