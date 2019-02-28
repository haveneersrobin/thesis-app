import React from "react";
import MultiSlider from "react-native-multi-slider";

const CustomMultiSlider = props => {
  return (
    <MultiSlider
      values={props.values}
      onValuesChangeFinish={props.onValuesChangeFinish}
      sliderLength={310}
      min={0}
      max={100}
      step={1}
      allowOverlap={false}
      snapped
      markerStyle={{ backgroundColor: "#5F6FEE" }}
      selectedStyle={{ backgroundColor: "#5F6FEE" }}
      containerStyle={{ marginRight: 10, marginLeft: 10 }}
    />
  );
};

export default CustomMultiSlider;
