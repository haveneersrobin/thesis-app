import React from "react";
import { createStackNavigator } from "react-navigation";
import { AppLoading } from "expo";
import { Font } from "expo";
import HomeScreen from "./screens/HomeScreen";
import PickArtistScreen from "./screens/PickArtistScreen";

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {
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
    return <RootStack />;
  }
}

const RootStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    PickArtist: { screen: PickArtistScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
