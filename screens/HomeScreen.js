import React from "react";
import { View } from "react-native";
import { LinearGradient, AuthSession } from "expo";
import { Entypo } from "@expo/vector-icons";
import styled from "styled-components";
import querystring from "querystring";
import Button from "../components/Button";
import { Buffer } from "buffer";
import axios from "axios";

var SPOTIFY_CLIENT_ID = "b2ff1c99b3fc459ca733f35ee9f3e068"; // Your client id
var SPOTIFY_CLIENT_SECRET = "cd4e85fd594644fe87df109a814adac1"; // Your secret

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 140;
`;

class HomeScreen extends React.Component {
  state = {
    userInfo: null,
    acces_token: null,
    refresh_token: null,
    error: null,
    didError: false
  };

  handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    var scope = "user-read-private user-read-email user-top-read";
    let results = await AuthSession.startAsync({
      authUrl:
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: SPOTIFY_CLIENT_ID,
          scope: scope,
          redirect_uri: redirectUrl
        })
    });
    if (results.type !== "success") {
      this.setState({ didError: true });
    } else {
      var body = {
        code: results.params.code,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code"
      };

      var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
            "base64"
          )
      };

      axios
        .post(
          "https://accounts.spotify.com/api/token",
          querystring.stringify(body),
          { headers: headers }
        )
        .then(response => {
          this.setState({
            acces_token: response.data.access_token,
            refresh_token: response.data.refresh_token
          });
        })
        .then(() => this.getTopArtist())
        .catch(error => {
          this.setState({ error });
        });
    }
  };

  getTopArtist() {
    axios
      .get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: "Bearer " + this.state.acces_token
        }
      })
      .then(response => {
        const filtered = response.data.items.map(item =>
          Object.keys(item)
            .filter(key => ["external_urls", "name", "images"].includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {})
        );

        const onlySmallImages = filtered.forEach(item => {
          console.log(item.images[0]);
          if (item) {
            item.images = item.images.slice(-2, -1);
          }
        });
        console.log(onlySmallImages);
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
            onPress={this.handleSpotifyLogin}
          >
            <Entypo name="spotify-with-circle" size={24} color="white" />
          </Button>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default HomeScreen;
