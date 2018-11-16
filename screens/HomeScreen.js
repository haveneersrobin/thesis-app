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
  justify-content: flex-end;
  padding-bottom: 140;
  background-color: #f2f2f2;
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
        <Button
          color={"#049138"}
          bgColor={"#C2F8CB"}
          text={"Log in with Spotify"}
          onPress={e => this.handleSpotifyLogin(e)}
        >
          <Entypo name="spotify-with-circle" size={24} color="#049138" />
        </Button>
        {this.state.didError && <Text>{this.state.error}</Text>}
      </StyledView>
    );
  }
}

export default HomeScreen;
