import React from "react";
import { createStackNavigator } from "react-navigation";
import { AppLoading } from "expo";
import HomeScreen from "./screens/HomeScreen";
import PickArtistScreen from "./screens/PickArtistScreen";
import SongOverviewScreen from "./screens/SongOverviewScreen";
import SearchArtistScreen from "./screens/SearchArtist";
import PartScreen from "./screens/PartScreen";
import { fromRight, opacityChange, loadAssets } from "./utils";

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
  } else if (
    prevScene &&
    currentScene &&
    prevScene.route.routeName === "PickArtist" &&
    currentScene.route.routeName === "Search"
  ) {
    return opacityChange();
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
        backgroundColor: "#5f6fee"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontFamily: "roboto-regular"
      }
    }
  }
);

const RootStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    PickArtist: { screen: PickArtistScreen },
    Search: { screen: SearchArtistScreen },
    SongOverviewScreen: { screen: AfterSelection },
    PartScreen: { screen: PartScreen }
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
