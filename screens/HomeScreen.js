import React, { Component } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo";
import { Entypo } from "@expo/vector-icons";
import styled from "styled-components";
import Button from "../components/Button";
import axios from "axios";
import { handleSpotifyLogin as login, getAccessToken } from "../api";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 40;
  padding-bottom: 40;
  background-color: #f2f2f2;
`;
const TitleContainer = styled(View)`
  padding-top: 20;
  flex: 7;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-items: center;
`;

const BottomContainer = styled(View)`
  flex: 1;
  width: 70%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  border-top-color: #e0e0e0;
  border-top-width: 2;
`;

const TitleText = styled(Text)`
  font-size: 86;
  margin-bottom: -8;
  font-family: "roboto-light";
`;

const Pronounciation = styled(Text)`
  font-size: 24;
  margin-bottom: 40;
  font-family: "roboto-thin";
`;

const Explanation = styled(Text)`
  font-size: 16;
  font-family: "roboto-light";
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: null,
      error: null,
      didError: false
    };

    this.handleSpotifyLogin = this.handleSpotifyLogin.bind(this);
    this.getTopArtist = this.getTopArtist.bind(this);
  }

  handleSpotifyLogin() {
    login().then(result => {
      if (result.type === "error") {
        this.setState({ didError: true, error: result.errorCode });
      } else if (result.type === "success") {
        this.getTopArtist();
      } else {
        this.setState({
          didError: true,
          error: "An unknown error has occured! :("
        });
      }
    });
  }

  getTopArtist() {
    getAccessToken().then(accessToken => {
      axios
        .get("https://api.spotify.com/v1/me/top/artists", {
          headers: {
            Authorization: "Bearer " + accessToken
          }
        })
        .then(response => {
          const filtered = response.data.items.map(item =>
            Object.keys(item)
              .filter(key =>
                ["external_urls", "name", "images", "id"].includes(key)
              )
              .reduce((obj, key) => {
                obj[key] = item[key];
                return obj;
              }, {})
          );
          this.setState({ artists: filtered }, () =>
            this.props.navigation.navigate("PickArtist", {
              artists: this.state.artists
            })
          );
        })
        .catch(error => {
          this.setState({ error });
        });
    });
  }

  render() {
    return (
      <StyledView>
        <TitleContainer>
          <TitleText>Mispre</TitleText>
          <Pronounciation>
            '{"<"} mis-puhr {">"}'{" "}
          </Pronounciation>
          <Explanation>
            Mobile Interface for Spotify Recommendations
          </Explanation>
        </TitleContainer>
        <BottomContainer>
          <Button
            color={"#049138"}
            bgColor={"#C2F8CB"}
            text={"Log in with Spotify"}
            onPress={e => this.handleSpotifyLogin(e)}
          >
            <Entypo name="spotify-with-circle" size={24} color="#049138" />
          </Button>
          {this.state.didError && <Text>{this.state.error}</Text>}
        </BottomContainer>
      </StyledView>
    );
  }
}

export default HomeScreen;
