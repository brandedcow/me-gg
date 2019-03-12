import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Redirect } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  display: flex;
  padding-top: 10%;
  align-items: center;
  flex-direction: column;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;
`;
const InputWrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  border-radius: 6px;

  -webkit-box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 69px 9px rgba(0, 0, 0, 0.75);
`;
const Input = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  padding: 0 20px;
  outline: none;
  border-radius: 6px 0 0 6px;
`;
const InputButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  width: 90px;
  background-color: #22afff;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
`;
const SearchIcon = styled.i`
  font-size: 23.5px;
  color: white;
`;
const Message = styled.div`
  color: white;
  font-size: 60px;
  font-weight: 600;
  padding: 30px 0;

  -webkit-text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
  -moz-text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
  text-shadow: 0px 0px 69px rgba(0, 0, 0, 0.9);
`;

const Search = () => {
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(
    () => {
      if (username) {
        axios
          .get(`/api/v1/summonerInfo?username=${username}`)
          .then(res => {
            if (res.data) {
              localStorage.setItem("user", JSON.stringify(res.data));
              setRedirect(true);
            }
          })
          .catch(err => console.log(err));
      }
    },
    [username]
  );

  const onSearch = () => {
    setUsername(query);
  };

  const onKeyPress = e => {
    if (e.key === "Enter") onSearch();
  };

  if (redirect) return <Redirect to={{ pathname: "/profile" }} />;

  return (
    <Container>
      <Content>
        <Message>Get Summoner Analytics</Message>
        <InputWrapper>
          <Input
            onKeyPress={onKeyPress}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <InputButton onClick={onSearch}>
            <SearchIcon className="fas fa-search" />
          </InputButton>
        </InputWrapper>
      </Content>
    </Container>
  );
};

export default Search;
