import React from "react";
import { View } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";

const FeaturesSliders = props => {
  return (
    <View>
      <MultiSlider
        values={[10, 90]}
        sliderLength={300}
        min={0}
        max={100}
        step={10}
        allowOverlap={false}
        snapped
      />
    </View>
  );
};

export default FeaturesSliders;
