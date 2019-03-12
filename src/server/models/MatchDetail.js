const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchDetailSchema = new Schema({
  accountId: { type: String, required: true },
  gameId: { type: Number, unique: true, required: true },
  frameInfo: [
    {
      totalGold: Number,
      teamScore: Number,
      participantId: Number,
      level: Number,
      currentGold: Number,
      minionsKilled: Number,
      position: { x: Number, y: Number },
      xp: Number,
      jungleMinionsKilled: Number
    }
  ],
  skills: [
    {
      timestamp: Number,
      skillSlot: Number,
      levelUpType: String
    }
  ],
  items: [
    {
      timestamp: Number,
      itemId: Number,
      transactionType: String,
      beforeId: Number,
      afterId: Number
    }
  ],
  kills: [
    {
      timestamp: Number,
      killerId: Number,
      victimId: Number,
      assistingParticipantIds: [Number],
      position: { x: Number, y: Number }
    }
  ],
  deaths: [
    {
      timestamp: Number,
      killerId: Number,
      victimId: Number,
      assistingParticipantIds: [Number],
      position: { x: Number, y: Number }
    }
  ],
  structureKills: [
    {
      timestamp: Number,
      towerType: String,
      timeId: Number,
      laneType: String,
      assistingParticipantIds: [Number],
      buildingType: String
    }
  ],
  eliteMonsterKills: [
    {
      timestamp: Number,
      monsterType: String,
      monsterSubType: String
    }
  ]
});

const MatchDetail = mongoose.model("MatchDetail", MatchDetailSchema);
module.exports = MatchDetail;
