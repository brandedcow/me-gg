const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
// From Account
accountId

// From Match list
gameId
queue
timestamp
lane
champion
season
role
platformId

// From Match Detail


*/

const MatchSchema = new Schema({
  // ids
  accountId: { type: String, required: true },
  gameId: { type: Number, unique: true, required: true },

  // match meta data
  queue: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  gameDuration: { type: Number, required: true },
  // summoner set up
  lane: { type: String, required: true },
  champion: { type: Number, required: true },
  summonerSkill1: { type: Number, required: true },
  summonerSkill2: { type: Number, required: true },
  runePrimary: Number,
  runeSecondary: Number,
  // legacy runes / mastery
  runes: [
    {
      runeId: Number,
      rank: Number
    }
  ],
  masteries: [
    {
      masteryId: Number,
      rank: Number
    }
  ],
  // summoner game stats
  kill: { type: Number, required: true },
  death: { type: Number, required: true },
  assist: { type: Number, required: true },
  cs: { type: Number, required: true },
  neutralMinionsKilled: { type: Number, required: true },
  laneMinionsKilled: { type: Number, required: true },
  level: { type: Number, required: true },
  //items
  item1: { type: Number, required: true },
  item2: { type: Number, required: true },
  item3: { type: Number, required: true },
  item4: { type: Number, required: true },
  item5: { type: Number, required: true },
  item6: { type: Number, required: true },
  trinket: { type: Number, required: true },
  // extra match data
  platformId: { type: String, required: true },
  role: { type: String, required: true },
  season: { type: Number, required: true },
  win: { type: Boolean, required: true }
});

const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
