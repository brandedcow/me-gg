import React, { useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { withRouter } from "react-router";

import Header from "_containers/Header";
import Main from "_containers/Main";
import BackgroundChanger from "_components/BackgroundChanger";
import BackgroundProvider from "_context/BackgroundContext";
import BG1 from "_assets/Backgrounds/bg1.jpg";
import BG2 from "_assets/Backgrounds/bg2.jpg";
import BG3 from "_assets/Backgrounds/bg3.jpg";
import BG4 from "_assets/Backgrounds/bg4.jpg";
import BG5 from "_assets/Backgrounds/bg5.jpg";
import BG6 from "_assets/Backgrounds/bg6.jpg";
import BG7 from "_assets/Backgrounds/bg7.jpg";
import BG8 from "_assets/Backgrounds/bg8.jpg";
import BG9 from "_assets/Backgrounds/bg9.jpg";

const GlobalStyle = createGlobalStyle`
  div {
    font-family: helvetica
  }
  input {
    border-style: none;
  }
`;
const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  return (
    <BackgroundProvider>
      <BackgroundChanger images={[BG1, BG2, BG3, BG4, BG5, BG6, BG7, BG8, BG9]}>
        <GlobalStyle />
        <Header />
        <Main style={{ flex: 1 }} />
      </BackgroundChanger>
    </BackgroundProvider>
  );
};

export default App;
