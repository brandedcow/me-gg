const axios = require("axios");
const config = require("../config/constants");

const Match = require("../models/Match");
const Summoner = require("../models/Summoner");
const MatchDetail = require("../models/MatchDetail");
const MatchList = require("../models/MatchList");

const sampleMatchList = require("../sampleData/matchList.json");
const sampleMatchDetail = require("../sampleData/matchDetail.json");
const sampleMatchTimeline = require("../sampleData/matchTimeline.json");

const dataDragonFetch = axios.create({
  baseURL: "https://ddragon.leagueoflegends.com/"
});

const riotApiFetch = axios.create({
  baseURL: "https://na1.api.riotgames.com/lol",
  headers: {
    "X-Riot-Token": config.RIOT_API_KEY
  }
});

const callRiotApiSummonerFetch = username => {
  return riotApiFetch
    .get(`/summoner/v4/summoners/by-name/${username}`)
    .then(response => response.data)
    .catch(() => {});
};

const callRiotApiMatchDetail = matchId => {
  return riotApiFetch
    .get(`/match/v4/matches/${matchId}`)
    .then(response => response.data)
    .catch(err => console.log(err));
};

const callRiotApiMatchTimeline = matchId => {
  return riotApiFetch
    .get(`/match/v4/timelines/by-match/${matchId}`)
    .then(response => response.data)
    .catch(err => console.log(err));
};

const callRiotApiMatchList = (accountId, beginIndex, endIndex, beginTime) => {
  let url = `/match/v4/matchlists/by-account/${accountId}`;
  if (beginIndex !== undefined) url += `?beginIndex=${beginIndex}`;
  if (endIndex !== undefined) url += `&endIndex=${endIndex}`;
  if (beginTime !== undefined) url += `&beginTime=${beginTime}`;
  return riotApiFetch
    .get(url)
    .then(response => response.data)
    .catch(err => console.log(err));
};

exports.getSummonerInfo = (req, res, next) => {
  const { username } = req.query;
  if (!username) return res.status(400).send();

  Summoner.findOne({ name: username })
    .then(existing => {
      callRiotApiSummonerFetch(username).then(summoner => {
        if (!summoner) return res.status(404).send();
        if (existing) {
          existing.update(summoner).catch(next);
        } else {
          Summoner.create(summoner).catch(next);
        }
        res.status(200).send(summoner);

        let beginIndex = 0;
        const accountId = summoner.accountId;

        const fetchApiIntervalId = setInterval(() => {
          const intervalDuration = 1000;
          callRiotApiMatchList(summoner.accountId, beginIndex)
            .then(matchListResponse => {
              const { matches, startIndex, endIndex } = matchListResponse;
              if (matches.length === 0) throw new Error("done");
              console.log(`${startIndex} to ${endIndex}`);
              matches.forEach(match => {
                MatchList.create({ accountId, ...match })
                  .then(() => {})
                  .catch(() => {});
              });
            })
            .catch(err => {
              clearInterval(fetchApiIntervalId);
              if (err.message === "done") {
                console.log("done");
              }
            });
          beginIndex += 100;
        }, 1000);
      });
    })
    .catch(next);
};

exports.updateSummonerMatches = (req, res, next) => {
  const { accountId } = req.query;
  if (!accountId) return res.status(400).send();

  Match.find({ accountId })
    .sort("-timestamp")
    .then(matches => {
      populateSummonerMatches(accountId, res, matches.length);
    })
    .catch(err => console.log(err));
};

exports.getSummonerMatches = (req, res, next) => {
  const { accountId } = req.query;
  if (!accountId) return res.status(400).send();

  Match.find({ accountId })
    .sort("-timestamp")
    .then(matches => {
      // populateSummonerMatches(accountId, res, matches.length);
      res.status(200).send(matches);
    })
    .catch(err => console.log(err));
};

populateSummonerMatches = (accountId, res, numberStoredMatches) => {
  console.log(`Populate Matches for ${accountId}, season 9`);
  const beginTimeStamp = new Date("1/24/2019").getTime();

  callRiotApiMatchList(accountId, 25, 125, beginTimeStamp)
    .then(initialQueryResponse => {
      if (!initialQueryResponse) throw new Error("Failed Riot API Fetch");
      const { totalGames } = initialQueryResponse;
      console.log(`Total Games to Populate: ${totalGames}`);

      let queryEndIndex = totalGames - (numberStoredMatches || 0);
      const intervalLimit = 3;
      const intervalDuration = 120000;

      const apiIntervalId = setInterval(() => {
        callRiotApiMatchList(
          accountId,
          queryEndIndex - intervalLimit,
          queryEndIndex
        )
          .then(matchListReponse => {
            if (!matchListReponse) throw new Error("Failed Riot API Fetch");
            const {
              startIndex,
              endIndex,
              totalGames,
              matches
            } = matchListReponse;
            console.log(`Matches ${startIndex} to ${endIndex}`);

            // If no more matches, done.
            if (matches.length === 0) {
              console.log("Done Populating.");
              throw new Error("Done");
            }

            // For each match, call match detail and match timelines
            matches.forEach(match => {
              callRiotApiMatchDetail(match.gameId).then(matchDetailResponse => {
                if (!matchDetailResponse)
                  throw new Error("Failed Riot API Fetch");
                callRiotApiMatchTimeline(match.gameId).then(
                  matchTimelineResponse => {
                    if (!matchTimelineResponse)
                      throw new Error("Failed Riot API Fetch");

                    // start parse
                    const {
                      participantIdentities,
                      participants,
                      gameDuration,
                      teams,
                      gameId
                    } = matchDetailResponse;
                    const playerIdentity = participantIdentities.find(
                      identity => identity.player.accountId === accountId
                    );
                    const playerParticipantId = playerIdentity.participantId;
                    const playerDetails = participants.find(
                      p => p.participantId === playerParticipantId
                    );
                    const {
                      stats: playerStats,
                      teamId: playerTeamId
                    } = playerDetails;
                    const win =
                      teams.find(team => team.teamId === playerTeamId).win ===
                      "Win";

                    const summonerSkill1 = playerDetails.spell1Id;
                    const summonerSkill2 = playerDetails.spell2Id;
                    const runePrimary = playerStats.perkPrimaryStyle;
                    const runeSecondary = playerStats.perkSubStyle;
                    const runes = playerStats.runes;
                    const masteries = playerStats.masteries;
                    const kill = playerStats.kills;
                    const death = playerStats.deaths;
                    const assist = playerStats.assists;
                    const neutralMinionsKilled =
                      playerStats.neutralMinionsKilled;
                    const laneMinionsKilled = playerStats.totalMinionsKilled;
                    const cs = neutralMinionsKilled + laneMinionsKilled;
                    const level = playerStats.champLevel;
                    const item1 = playerStats.item0;
                    const item2 = playerStats.item1;
                    const item3 = playerStats.item2;
                    const item4 = playerStats.item3;
                    const item5 = playerStats.item4;
                    const item6 = playerStats.item5;
                    const trinket = playerStats.item6;

                    const matchSummary = {
                      accountId,
                      ...match,
                      gameDuration,
                      summonerSkill1,
                      summonerSkill2,
                      runePrimary,
                      runeSecondary,
                      runes,
                      masteries,
                      kill,
                      death,
                      assist,
                      neutralMinionsKilled,
                      laneMinionsKilled,
                      cs,
                      level,
                      item1,
                      item2,
                      item3,
                      item4,
                      item5,
                      item6,
                      trinket,
                      win
                    };

                    Match.create(matchSummary)
                      .then(() => console.log("created Match"))
                      .catch(err => console.log("match creation error", err));

                    const { frames } = matchTimelineResponse;
                    const detail = frames.reduce(
                      (acc, frame) => {
                        const { participantFrames, events } = frame;
                        const itemEvents = events
                          .filter(
                            event =>
                              event.participantId ===
                                playerIdentity.participantId &&
                              (event.type === "ITEM_PURCHASED" ||
                                event.type === "ITEM_SOLD" ||
                                event.type === "ITEM_DESTROYED" ||
                                event.type === "ITEM_UNDO")
                          )
                          .map(event => {
                            const { type, ...restOfEvent } = event;
                            return {
                              transactionType: type,
                              ...restOfEvent
                            };
                          });
                        const skillEvents = events
                          .filter(
                            event =>
                              event.participantId ===
                                playerIdentity.participantId &&
                              event.type === "SKILL_LEVEL_UP"
                          )
                          .map(event => {
                            const { type, ...restOfEvent } = event;
                            return { ...restOfEvent };
                          });
                        const killEvents = events.filter(event => {
                          const { assistingParticipantIds } = event;
                          if (event.type === "CHAMPION_KILL") {
                            if (assistingParticipantIds) {
                              if (
                                assistingParticipantIds.find(
                                  ap => ap === playerIdentity.participantId
                                )
                              )
                                return true;
                            }
                            if (event.killerId === playerIdentity.participantId)
                              return true;
                          }
                          return false;
                        });
                        const deathEvents = events.filter(
                          event =>
                            event.victimId === playerIdentity.participantId &&
                            event.type === "CHAMPION_KILL"
                        );
                        const structureKillEvents = events.filter(
                          event =>
                            playerDetails.teamId === event.teamId &&
                            event.type === "BUILDING_KILL"
                        );
                        const eliteMonsterKillEvents = events.filter(event => {
                          if (event.type === "ELITE_MONSTER_KILL") {
                            if (
                              event.killerId > 4 &&
                              playerIdentity.participantId > 4
                            ) {
                              return true;
                            } else if (
                              event.killerId <= 4 &&
                              playerIdentity.participantId <= 4
                            ) {
                              return true;
                            } else {
                              return false;
                            }
                          }
                          return false;
                        });

                        acc.items = acc.items.concat(itemEvents);
                        acc.skills = acc.skills.concat(skillEvents);
                        acc.kills = acc.kills.concat(killEvents);
                        acc.deaths = acc.deaths.concat(deathEvents);
                        acc.structureKills = acc.structureKills.concat(
                          structureKillEvents
                        );
                        acc.eliteMonsterKills = acc.eliteMonsterKills.concat(
                          eliteMonsterKillEvents
                        );
                        acc.frameInfo.push(
                          participantFrames[playerIdentity.participantId]
                        );
                        return acc;
                      },
                      {
                        gameId,
                        accountId,
                        frameInfo: [],
                        skills: [],
                        items: [],
                        kills: [],
                        deaths: [],
                        structureKills: [],
                        eliteMonsterKills: []
                      }
                    );
                    MatchDetail.create(detail)
                      .then(() => console.log("created Match Detail"))
                      .catch(err => console.log("match deatil error", err));
                  } // end of match detail and timeline response
                );
              });
            }); // end of forEach match from matchList
          })
          .catch(err => {
            clearInterval(apiIntervalId);
            if (err.message === "Failed Riot API Fetch") {
              res.status(400).send(err.message);
            }
            if (err.message === "Done") {
              console.log("send List");
              Match.find({ accountId })
                .sort("-timestamp")
                .limit(98)
                .then(list => {
                  res.status(200).send(list);
                });
            }
          });

        queryEndIndex -= intervalLimit;
      }, intervalDuration);
    }) // end of initialQueryResponse
    .catch(err => {
      if (err.message === "Failed Riot API Fetch") {
        res.status(400).send(err.message);
      }
    });
};
