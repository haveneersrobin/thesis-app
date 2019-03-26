import React, { Component } from "react";
import { View, Text, Image, NetInfo, Platform, Switch } from "react-native";
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
import FlashMessage from "react-native-flash-message";
import { AppInstalledChecker } from "react-native-check-app-install";
import {
  responsiveFontSize,
  responsiveHeight
} from "react-native-responsive-dimensions";

import Dialog from "react-native-dialog";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 40;
  padding-bottom: 20;
  background-color: #f2f2f2;
`;
const TitleContainer = styled(View)`
  flex: 20;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-items: center;
`;

const BottomContainer = styled(View)`
  flex: 5;
  width: 70%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-color: #e0e0e0;
  border-top-width: 2;
`;

const VersionContainer = styled(View)`
  justify-content: flex-end;
  flex: 1;
`;

const ProfileView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: ${responsiveHeight(3)};
`;

const TitleText = styled(Text)`
  font-size: ${responsiveFontSize(10)};
  font-family: "roboto-light";
`;

const Pronounciation = styled(Text)`
  font-size: ${responsiveFontSize(3)};
  font-family: "roboto-thin";
`;

const Explanation = styled(Text)`
  font-size: ${responsiveFontSize(1.6)};
  font-family: "roboto-light";
`;

const ProfileImage = styled(Image)`
  border-radius: 50;
  margin-right: 8px;
  width: ${responsiveHeight(2.2)};
  height: ${responsiveHeight(2.2)};
`;

const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SwitchView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      didError: false,
      accessToken: null,
      profileInfo: null,
      loading: true,
      connected: false,
      wifi: false,
      chrome_installed: false,
      switchValue: false
    };
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Confirm exit", "Do you want to quit the app?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Ok, exit!",
        onPress: () => BackHandler.exitApp()
      }
    ]);

    return true;
  };

  componentWillMount() {
    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type === "cellular") {
      this.refs.flashMessage.showMessage({
        message: "Mobile Data",
        description:
          "You are not using Wi-Fi. Beware of possible carrier charges. You can tap this message to dismiss it.",
        type: "warning"
      });
    } else if (connectionInfo.type === "wifi") {
      this.refs.flashMessage.hideMessage();
    }
    this.setState({
      connected: connectionInfo.type !== "none",
      wifi: connectionInfo.type === "wifi"
    });
  };

  componentDidMount = async () => {
    const connection = await NetInfo.getConnectionInfo();
    const chrome_installed = await AppInstalledChecker.checkURLScheme(
      "googlechrome"
    );
    if (chrome_installed) this.setState({ chrome_installed: chrome_installed });
    if (connection.type === "cellular") {
      this.refs.flashMessage.showMessage({
        message: "Mobile Data",
        description:
          "You are not using Wi-Fi. Beware of possible carrier charges. You can tap this message to dismiss it.",
        type: "warning"
      });
    }
    if (connection.type !== "none") {
      this.setState({
        accessToken: await getAccessToken(),
        profileInfo: await getNameAndPicture(),
        connected: true,
        wifi: connection.type === "wifi"
      });
    }
    this.setState({ loading: false, dialogVisible: true });
  };

  handleSpotifyLogin = async () => {
    let result;
    let userId;
    try {
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
      alertError(result);
      alertError("[handle Spotify login] An unknown error has occured.");
    }
  };

  logoutSpotify = async () => {
    this.setState({ profileInfo: null, accessToken: null });
    logout();
  };

  continue = () => {
    Analytics.setUserProp({
      expID: this.state.experimentID,
      version: this.state.switchValue ? "B" : "A"
    });
    this.props.navigation.navigate("PartScreen", {
      part: 1,
      version: this.state.switchValue ? "B" : "A"
    });
  };

  continueWithoutLogin = async () => {
    const userId = await getUserID();
    Analytics.identify(userId);
    Analytics.track(Analytics.events.CONTINUE_NO_LOGIN, { id: userId });
    this.continue();
  };

  closeDialog = () => {
    this.setState({ dialogVisible: false });
  };

  confirmDialog = () => {
    if (this.state.experimentID) {
      this.setState({ dialogVisible: false });
    }
  };

  setExperimentID = id => {
    this.setState({ experimentID: id });
  };

  toggleSwitch = value => {
    this.setState({ switchValue: value });
  };

  render() {
    return (
      <StyledView>
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid} />
        <View>
          <Dialog.Container
            useNativeDriver={true}
            visible={this.state.dialogVisible}
          >
            <Dialog.Title style={{ fontFamily: "roboto-bold" }}>
              Experiment ID
            </Dialog.Title>
            <Dialog.Description style={{ fontFamily: "roboto-regular" }}>
              Please (carefully) enter your experiment ID given to you on paper.
            </Dialog.Description>
            <Dialog.Input
              keyboardType="numeric"
              style={{ fontFamily: "roboto-regular" }}
              onChangeText={this.setExperimentID}
              placeholder="ID"
              underlineColorAndroid="#e0e0e0"
            />
            <Dialog.Button
              style={{ fontFamily: "roboto-regular", color: "#5F6FEE" }}
              label="Submit"
              onPress={this.confirmDialog}
            />
          </Dialog.Container>
        </View>
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

          {((Platform.OS === "android" && this.state.chrome_installed) ||
            Platform.OS === "ios") &&
            this.state.connected &&
            !this.state.loading &&
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

          {((Platform.OS === "android" && this.state.chrome_installed) ||
            Platform.OS === "ios") &&
            this.state.connected &&
            !this.state.loading &&
            this.state.accessToken &&
            this.state.profileInfo && (
              <View>
                <ProfileView>
                  <Text
                    style={{
                      fontFamily: "roboto-bold",
                      marginRight: 10,
                      fontSize: responsiveFontSize(1.4)
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
                <SwitchView>
                  <Text
                    style={{
                      fontFamily: "roboto-bold",
                      marginRight: 10,
                      fontSize: responsiveFontSize(1.4)
                    }}
                  >
                    A
                  </Text>
                  <Switch
                    onValueChange={this.toggleSwitch}
                    value={this.state.switchValue}
                    thumbColor={"#5F6FEE"}
                    trackColor={{ false: "#a5afff", true: "#a5afff" }}
                  />
                  <Text
                    style={{
                      fontFamily: "roboto-bold",
                      marginLeft: 10,
                      fontSize: responsiveFontSize(1.4)
                    }}
                  >
                    B
                  </Text>
                </SwitchView>
              </View>
            )}
          {((Platform.OS === "android" && this.state.chrome_installed) ||
            Platform.OS === "ios") &&
            !this.state.connected &&
            !this.state.loading && (
              <Text>
                Please connect to the internet to use this application.
              </Text>
            )}

          {Platform.OS === "android" &&
            !this.state.chrome_installed &&
            !this.state.loading && (
              <Text style={{ textAlign: "center" }}>
                Please install Google Chrome to use this app.
              </Text>
            )}

          {this.state.didError && <Text>{this.state.error}</Text>}
        </BottomContainer>

        <VersionContainer>
          <Text style={{ fontSize: responsiveFontSize(1) }}>Version 1.1.0</Text>
        </VersionContainer>
        <FlashMessage
          ref="flashMessage"
          position="top"
          animated={true}
          autoHide={false}
          floating={true}
        />
      </StyledView>
    );
  }
}

export default HomeScreen;
