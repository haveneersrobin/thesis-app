import { Animated, Easing, Alert } from "react-native";
import { Font, Asset } from "expo";
import {
  Entypo,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons
} from "@expo/vector-icons";

export const fromRight = (duration = 300) => {
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
};

export const opacityChange = (duration = 1000) => {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const thisSceneIndex = scene.index;

      const opacity = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1]
      });

      return { opacity };
    }
  };
};

export const loadAssets = async () => {
  const imageAssets = _cacheImages([
    require("./assets/img/check.png"),
    require("./assets/img/play.png"),
    require("./assets/img/pause.png")
  ]);

  const fontAssets = _cacheFonts([
    { "roboto-black": require("./assets/fonts/Roboto-Black.ttf") },
    { "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf") },
    { "roboto-light": require("./assets/fonts/Roboto-Light.ttf") },
    { "roboto-medium": require("./assets/fonts/Roboto-Medium.ttf") },
    { "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf") },
    { "roboto-thin": require("./assets/fonts/Roboto-Thin.ttf") },
    MaterialCommunityIcons.font,
    MaterialIcons.font,
    Entypo.font,
    Feather.font
  ]);
  await Promise.all([...imageAssets, ...fontAssets]);
};

const _cacheImages = images => {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

export const alertError = error => {
  const message = JSON.stringify(error);
  Alert.alert("Error", `An error has occured: ${message.substring(0, 1000)}`, [
    {
      text: "Dismiss",
      style: "cancel"
    }
  ]);
};

const _cacheFonts = fonts => {
  return fonts.map(font => Font.loadAsync(font));
};

export const ellipsize = text => {
  if (text.length > 35) {
    return text.substring(0, 35) + "...";
  }
  return text;
};
