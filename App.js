import React from "react";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
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
    return <RootNavigator />;
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

const RootNavigator = createAppContainer(
  createSwitchNavigator({
    afterArtistSelection: {
      screen: createStackNavigator(
        {
          SongOverviewScreen: { screen: SongOverviewScreen }
        },
        {
          initialRouteName: "SongOverviewScreen",
          headerMode: "screen",
          gesturesEnabled: false,
          transitionConfig: scenes => handleCustomTransition(scenes),
          defaultNavigationOptions: {
            headerVisible: true,
            headerStyle: {
              backgroundColor: "#5f6fee",
              elevation: 0
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "roboto-regular"
            }
          }
        }
      )
    },
    loginFlow: {
      screen: createSwitchNavigator(
        {
          Home: { screen: HomeScreen },
          PartScreen: { screen: PartScreen }
        },
        {
          initialRouteName: "Home",
          headerMode: "none",
          gesturesEnabled: false,
          transitionConfig: scenes => handleCustomTransition(scenes),
          defaultNavigationOptions: {
            headerVisible: false
          }
        }
      )
    },
    artistSelection: {
      screen: createStackNavigator(
        {
          PickArtist: { screen: PickArtistScreen },
          Search: { screen: SearchArtistScreen }
        },
        {
          initialRouteName: "PickArtist",
          headerMode: "none",
          gesturesEnabled: false,
          transitionConfig: scenes => handleCustomTransition(scenes),
          defaultNavigationOptions: {
            headerVisible: false
          }
        }
      )
    }
  })
);
