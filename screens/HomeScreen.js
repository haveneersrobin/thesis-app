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
import { Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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
  margin-top: 20px;
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      didError: false,
      accessToken: "initial",
      profileInfo: null
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
      accessToken: await getAccessToken().catch(err => console.log(err)),
      profileInfo: await getNameAndPicture().catch(err => console.log(err))
    });
  }

  async handleSpotifyLogin() {
    const result = await login().catch(err => console.log(err));
    if (result.type == "error") {
      this.setState({ didError: true, error: result.errorCode });
    } else if (result.type == "success") {
      const userId = await getUserID().catch(err => console.log(err));
      Analytics.identify(userId);
      Analytics.track(Analytics.events.LOGGED_IN, { id: userId });
      this.continue();
    } else {
      this.setState({
        didError: true,
        error: "An unknown error has occured! :("
      });
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

          {this.state.accessToken &&
            this.state.accessToken !== "initial" &&
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
                    source={{ uri: this.state.profileInfo.image }}
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
        </BottomContainer>
      </StyledView>
    );
  }
}

export default HomeScreen;
