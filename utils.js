import { Animated, Easing } from "react-native";
import { Font, Asset } from "expo";

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

export const loadAssets = async () => {
  const imageAssets = _cacheImages([require("./assets/img/check.png")]);

  const fontAssets = _cacheFonts([
    { droid: require("./assets/fonts/DroidSans.ttf") },
    { "droid-bold": require("./assets/fonts/DroidSans-Bold.ttf") },
    { "roboto-black": require("./assets/fonts/Roboto-Black.ttf") }
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

const _cacheFonts = fonts => {
  return fonts.map(font => Font.loadAsync(font));
};
