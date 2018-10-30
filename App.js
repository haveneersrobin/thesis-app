import React from "react";
import { createStackNavigator } from "react-navigation";
import { AppLoading } from "expo";
import { Animated, Easing } from "react-native";
import { Font } from "expo";
import HomeScreen from "./screens/HomeScreen";
import PickArtistScreen from "./screens/PickArtistScreen";
import { fromLeft } from "react-navigation-transitions";

function fromRight(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}

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
      { "droid-bold": require("./assets/fonts/DroidSans-Bold.ttf") },
      { "roboto-black": require("./assets/fonts/Roboto-Black.ttf") }
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

const RootStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    PickArtist: { screen: PickArtistScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    gesturesEnabled: false,
    transitionConfig: scenes => handleCustomTransition(scenes),
    navigationOptions: {
      headerVisible: false
    }
  }
);
