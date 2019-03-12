import React, { useState } from "react";

export const SummonerContext = React.createContext([{}, () => {}]);

const SummonerProvider = props => {
  const defaultInfo = {
    accountId: "",
    id: "",
    name: "",
    profileIconId: 0,
    puuid: "",
    revisionDate: 0,
    summonerLevel: 0
  };
  const [summonerInfo, setSummonerInfo] = useState(defaultInfo);

  return (
    <SummonerContext.Provider value={[summonerInfo, setSummonerInfo]}>
      {props.children}
    </SummonerContext.Provider>
  );
};

export default SummonerProvider;
