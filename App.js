import React from "react";
import { createStackNavigator } from "react-navigation";
import { AppLoading } from "expo";
import HomeScreen from "./screens/HomeScreen";
import PickArtistScreen from "./screens/PickArtistScreen";
import SongOverviewScreen from "./screens/SongOverviewScreen";
import { fromRight, loadAssets } from "./utils";

export default class App extends React.Component {
  state = {
    isReady: false
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={loadAssets}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return <RootStack />;
  }
}

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2] || undefined;
  const currentScene = scenes[scenes.length - 1] || undefined;

  if (
    prevScene &&
    currentScene &&
    prevScene.route.routeName === "Home" &&
    currentScene.route.routeName === "PickArtist"
  ) {
    return fromRight();
  }
};

const AfterSelection = createStackNavigator(
  {
    SongOverviewScreen: { screen: SongOverviewScreen }
  },
  {
    initialRouteName: "SongOverviewScreen",
    headerMode: "screen",
    gesturesEnabled: false,
    transitionConfig: scenes => handleCustomTransition(scenes),
    navigationOptions: {
      headerVisible: true,
      headerStyle: {
        backgroundColor: "#8360C3"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontFamily: "droid-bold"
      }
    }
  }
);

const RootStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    PickArtist: { screen: PickArtistScreen },
    SongOverviewScreen: { screen: AfterSelection }
  },
  {
    initialRouteName: "SongOverviewScreen",
    headerMode: "none",
    gesturesEnabled: false,
    transitionConfig: scenes => handleCustomTransition(scenes),
    navigationOptions: {
      headerVisible: false
    }
  }
);
