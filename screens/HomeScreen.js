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
  margin-bottom: 140;
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      access_token: null,
      refresh_token: null,
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
    getAccessToken();

    axios
      .get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: "Bearer " + this.state.access_token
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
      })
      .catch(error => this.setState({ error }));
  }

  render() {
    return (
      <LinearGradient
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%"
        }}
        start={[1, 0]}
        end={[0, 1]}
        colors={["#8360C3", "rgba(46, 191, 145, 0.4)"]}
      >
        <StyledView>
          <Button
            bgColor={"#23CF5F"}
            text={"Log in with Spotify"}
            onPress={e => this.handleSpotifyLogin(e)}
          >
            <Entypo name="spotify-with-circle" size={24} color="white" />
          </Button>
          {this.state.didError && <Text>{this.state.error}</Text>}
        </StyledView>
      </LinearGradient>
    );
  }
}

export default HomeScreen;
