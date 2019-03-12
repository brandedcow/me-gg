import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
// import "_styles/Header.css";

const Container = styled.div`
  background-color: "transparent";
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.div`
  color: #f7ece1;
  font-size: 35px;
  font-weight: 550;

  -webkit-text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
  -moz-text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
  text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
`;
const IconWrapper = styled.div`
  height: 40px;
  width: 40px;
  margin-right: 10px;
  border-radius: 40px;
  -webkit-box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
`;

const Icon = styled.i`
  font-size: 35px;
  color: white;
  cursor: pointer;
`;

const Header = () => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const title = user ? user.name.toUpperCase() : "ME";

  const removeUser = () => {
    localStorage.removeItem("user");
    setForceUpdate(!forceUpdate);
  };

  return (
    <Container>
      <Link to={user ? "/profile" : "/"} style={{ textDecoration: "none" }}>
        <TitleContainer>
          {user && (
            <IconWrapper>
              <img
                src={`/assets/9.5.1/img/profileicon/${user.profileIconId}.png`}
                width="40"
                height="40"
                style={{ borderRadius: 40 }}
              />
            </IconWrapper>
          )}

          <Title>
            {title}
            <span style={{ color: "#22afff" }}>.</span>GG
          </Title>
        </TitleContainer>
      </Link>
      {user && <Icon onClick={removeUser} className="fas fa-sign-out-alt" />}
    </Container>
  );
};

export default Header;
