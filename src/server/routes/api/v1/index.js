const router = require("express").Router();
const riotAPIService = require("../../../services/riotAPI.js");

router.route("/summonerInfo").get(riotAPIService.getSummonerInfo);
router
  .route("/updateSummonerMatches")
  .get(riotAPIService.updateSummonerMatches);
router.route("/summonerMatches").get(riotAPIService.getSummonerMatches);

module.exports = router;
