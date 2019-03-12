import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router-dom";

import MatchSummaryCard from "_components/MatchSummaryCard";
import { BackgroundContext } from "_context/BackgroundContext";

const Container = styled.div`
  flex: 1;
  border: 1px solid red;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const SubHeader = styled.div`
  background-color: "transparent";
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 50px;
  border: 1px solid red;
`;
const Content = styled.div`
  flex: 1;
  border: 1px solid blue;
  width: 100%;
`;

const Profile = () => {
  const [redirect, setRedirect] = useState(false);
  const [update, setUpdate] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [backgroundType, setBackgroundType] = useContext(BackgroundContext);

  useEffect(() => {
    axios
      .get(`api/v1/summonerMatches?accountId=${user.accountId}`)
      .then(res => {
        setMatchList(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(
    () => {
      if (update) {
        console.log(backgroundType, setBackgroundType);
        setBackgroundType(1);
        console.log(backgroundType);
        setUpdate(false);
        // axios
        //   .get(`api/v1/updateSummonerMatches?accountId=${user.accountId}`)
        //   .then(res => {
        //     setMatchList(res.data);
        //     setUpdate(false);
        //   })
        //   .catch(err => console.log(err));
      }
    },
    [update]
  );

  const updateMatchList = () => setUpdate(true);

  const renderMatchCard = match => {
    return <div key={match._id} />;
  };

  console.log(matchList);

  return (
    <Container>
      <SubHeader>
        <button onClick={updateMatchList}>Update</button>
      </SubHeader>
      <Content>{matchList.map(renderMatchCard)}</Content>
    </Container>
  );
};

export default Profile;
