import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import styled from "styled-components";
// import ArtistSelectionScreen from "./screens/ArtistSelectionScreen";
import Button from "./components/Button";
import { LinearGradient, AppLoading } from "expo";
import { Entypo } from "@expo/vector-icons";
import { Font } from "expo";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 140;
`;

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

class HomeScreen extends React.Component {
  state = {
    isReady: false
  };

  async _loadAssetsAsync() {
    const fontAssets = cacheFonts([
      { droid: require("./assets/fonts/DroidSans.ttf") },
      { "droid-bold": require("./assets/fonts/DroidSans-Bold.ttf") }
    ]);
    await Promise.all([...fontAssets]);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
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
          <Button bgColor={"#23CF5F"} text={"Log in with Spotify"}>
            <Entypo name="spotify-with-circle" size={24} color="white" />
          </Button>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default createStackNavigator(
  {
    Home: { screen: HomeScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
