import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import Analytics from "../Analytics";
import styled from "styled-components";
import Button from "../components/Button";
import {
  handleSpotifyLogin as login,
  getAccessToken,
  getUserID,
  getNameAndPicture,
  logout
} from "../api";
import { alertError } from "../utils";
import { Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { AndroidBackHandler } from "react-navigation-backhandler";
import { SkypeIndicator } from "react-native-indicators";

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
  flex: 5;
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
  padding-top: 10px;
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

const ProfileImage = styled(Image)`
  border-radius: 50;
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

const ProfileView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 15px;
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      didError: false,
      accessToken: null,
      profileInfo: null,
      loading: true
    };
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Confirm exit", "Do you want to quit the app?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Ok, exit.",
        onPress: () => BackHandler.exitApp()
      }
    ]);

    return true;
  };

  async componentDidMount() {
    this.setState({
      accessToken: await getAccessToken(),
      profileInfo: await getNameAndPicture(),
      loading: false
    });
  }

  async handleSpotifyLogin() {
    let result;
    let userId;
    try {
      alertError("login");
      result = await login();
    } catch (error) {
      alertError("[handle Spotify login] Couldn't login.");
    }
    if (result && result.type == "error") {
      this.setState({ didError: true, error: result.errorCode });
    } else if (result && result.type == "success") {
      try {
        userId = await getUserID();
      } catch (error) {
        alertError("[handle Spotify login] Couldn't fetch user id.");
      }
      Analytics.identify(userId);
      Analytics.track(Analytics.events.LOGGED_IN, { id: userId });
      this.continue();
    } else {
      alertError("[handle Spotify login] An unknown error has occured.");
    }
  }

  async logoutSpotify() {
    this.setState({ profileInfo: null, accessToken: null });
    logout();
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
          {this.state.loading && <SkypeIndicator color={"#5F6FEE"} size={40} />}

          {!this.state.loading &&
            !this.state.accessToken &&
            !this.state.profileInfo && (
              <Button
                color={"#049138"}
                bgColor={"#C2F8CB"}
                text={"Log in with Spotify"}
                onPress={() => this.handleSpotifyLogin()}
              >
                <Entypo name="spotify-with-circle" size={24} color="#049138" />
              </Button>
            )}

          {!this.state.loading &&
            this.state.accessToken &&
            this.state.profileInfo && (
              <View>
                <ProfileView>
                  <Text
                    style={{
                      fontFamily: "roboto-bold",
                      marginRight: 10
                    }}
                  >
                    Logged in as:
                  </Text>
                  <ProfileImage
                    source={
                      this.state.profileInfo.image
                        ? { uri: this.state.profileInfo.image }
                        : require("../assets/img/profile.png")
                    }
                  />
                  <Text
                    style={{
                      fontFamily: "roboto-light"
                    }}
                  >
                    {this.state.profileInfo.name}
                  </Text>
                </ProfileView>
                <ButtonView>
                  <View style={{ marginRight: 6 }}>
                    <Button
                      color="#5F6FEE"
                      borderColor={"#5F6FEE"}
                      bgColor="white"
                      text={"Logout"}
                      onPress={() => this.logoutSpotify()}
                    >
                      <MaterialCommunityIcons
                        name="logout"
                        size={24}
                        color="#5F6FEE"
                      />
                    </Button>
                  </View>
                  <View style={{ marginLeft: 6 }}>
                    <Button
                      text={"Continue"}
                      onPress={() => this.continueWithoutLogin()}
                    >
                      <Ionicons
                        name="ios-play-circle"
                        size={24}
                        color="white"
                      />
                    </Button>
                  </View>
                </ButtonView>
              </View>
            )}

          {this.state.didError && <Text>{this.state.error}</Text>}
          <Text style={{ fontSize: 9 }}>Version 1.0.1</Text>
        </BottomContainer>
      </StyledView>
    );
  }
}

export default HomeScreen;
