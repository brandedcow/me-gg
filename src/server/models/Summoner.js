const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SummonerSchema = new Schema({
  accountId: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  profileIconId: { type: Number, required: true },
  puuid: { type: String, required: true },
  revisionDate: { type: Number, required: true },
  summonerLevel: { type: Number, required: true }
});

const Summoner = mongoose.model("Summoner", SummonerSchema);
module.exports = Summoner;
