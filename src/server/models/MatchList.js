const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchListSchema = new Schema({
  accountId: { type: String, required: true },
  gameId: { type: Number, unique: true, required: true },
  queue: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  lane: { type: String, required: true },
  champion: { type: Number, required: true },
  platformId: { type: String, required: true },
  role: { type: String, required: true },
  season: { type: Number, required: true }
});

const MatchList = mongoose.model("MatchList", MatchListSchema);
module.exports = MatchList;
