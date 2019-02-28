import React, { Component } from "react";
import { View, Text, BackHandler, Alert } from "react-native";
import Analytics from "../Analytics";
import styled from "styled-components";
import Button from "../components/Button";
import axios from "axios";
import { SecureStore } from "expo";
import { handleSpotifyLogin as login, getAccessToken, getUserID } from "../api";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AndroidBackHandler } from "react-navigation-backhandler";

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
      error: null,
      didError: false,
      accessToken: "initial"
    };

    this.handleSpotifyLogin = this.handleSpotifyLogin.bind(this);
    this.continue = this.continue.bind(this);
  }

  async componentDidMount() {
    this.setState({ accessToken: await getAccessToken() });
  }

  async handleSpotifyLogin() {
    const result = await login();
    if (result.type == "error") {
      this.setState({ didError: true, error: result.errorCode });
    } else if (result.type == "success") {
      const userId = await getUserID();
      Analytics.identify(userId);
      Analytics.track(Analytics.events.LOGGED_IN, { id: userId });
      this.continue;
    } else {
      this.setState({
        didError: true,
        error: "An unknown error has occured! :("
      });
    }
  }

  continue() {
    this.props.navigation.navigate("PartScreen", {
      part: 1
    });
  }

  async continueWithoutLogin() {
    const userId = await getUserID();
    Analytics.identify(userId, { id: userId });
    Analytics.track(Analytics.events.CONTINUE_NO_LOGIN, { id: userId });
    this.continue();
  }

  render() {
    return (
      <StyledView>
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid} />
        <TitleContainer>
          <TitleText>Mispre</TitleText>
          <Pronounciation>
            '{"<"} mis-puhr {">"}'
          </Pronounciation>
          <Explanation>
            Mobile Interface for Spotify Recommendations
          </Explanation>
        </TitleContainer>
        <BottomContainer>
          {!this.state.accessToken && (
            <Button
              color={"#049138"}
              bgColor={"#C2F8CB"}
              text={"Log in with Spotify"}
              onPress={() => this.handleSpotifyLogin()}
            >
              <Entypo name="spotify-with-circle" size={24} color="#049138" />
            </Button>
          )}

          {this.state.accessToken && this.state.accesToken !== "initial" && (
            <Button text={"Start"} onPress={() => this.continueWithoutLogin()}>
              <AntDesign name="login" size={24} color="white" />
            </Button>
          )}
          {this.state.didError && <Text>{this.state.error}</Text>}
        </BottomContainer>
      </StyledView>
    );
  }
}

export default HomeScreen;
