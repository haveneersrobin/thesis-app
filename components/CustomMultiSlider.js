import React from "react";
import MultiSlider from "react-native-multi-slider";

import {
  responsiveWidth,
  responsiveHeight
} from "react-native-responsive-dimensions";

const CustomMultiSlider = props => {
  return (
    <MultiSlider
      values={props.values}
      onValuesChangeFinish={props.onValuesChangeFinish}
      sliderLength={responsiveWidth(70)}
      min={0}
      max={100}
      step={1}
      allowOverlap={false}
      snapped
      markerStyle={{ backgroundColor: "#5F6FEE" }}
      selectedStyle={{ backgroundColor: "#5F6FEE" }}
      containerStyle={{
        marginRight: responsiveWidth(4),
        marginLeft: responsiveWidth(4),
        marginTop: responsiveHeight(0.4),
        marginBottom: responsiveHeight(1.2)
      }}
    />
  );
};

export default CustomMultiSlider;
