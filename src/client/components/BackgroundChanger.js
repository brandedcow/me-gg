import React, { useState, useEffect, useContext } from "react";
import styled, { keyframes } from "styled-components";

import useInterval from "_hooks/useInterval";
import { BackgroundContext } from "_context/BackgroundContext";

const slide = keyframes`
  from {
    background-position: 0 -100px;
  }
  to {
    background-position: 0 0;
  }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const BackgroundImage = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -999;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transition: background 3s;
`;

const BackgroundChanger = ({ children, images }) => {
  const [activeBackgroundIndex, setActiveBackgroundIndex] = useState(0);
  const [nextBackgroundIndex, setNextBackgroundIndex] = useState(1);
  const [activeBackgrounds, setActiveBackgrounds] = useState([]);
  const [backgroundType, setBackgroundType] = useContext(BackgroundContext);
  console.log(backgroundType);

  useInterval(() => {
    setActiveBackgroundIndex(nextImageIndex());
  }, 4000);

  const nextImageIndex = () => {
    return activeBackgroundIndex >= images.length - 1
      ? 0
      : activeBackgroundIndex + 1;
  };

  return (
    <Container>
      {backgroundType === 0 && (
        <BackgroundImage
          style={{ backgroundImage: `url(${images[activeBackgroundIndex]})` }}
        />
      )}

      {children}
    </Container>
  );
};

export default BackgroundChanger;
