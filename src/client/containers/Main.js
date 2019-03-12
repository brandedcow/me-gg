import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Search from "_containers/Search";
import Profile from "_containers/Profile";
import SummonerProvider from "_context/SummonerContext";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = ({ style }) => {
  return (
    <Container style={{ ...style }}>
      <SummonerProvider>
        <Switch>
          <Route exact path="/" component={Search} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </SummonerProvider>
    </Container>
  );
};

export default Main;
