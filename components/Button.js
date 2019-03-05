import React from "react";
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from "react-native";
import { MyText } from "../styles";
import styled from "styled-components";

import { responsiveFontSize } from "react-native-responsive-dimensions";

// padding: 14px 19px or 15px 20px
const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${props => (props.bgColor ? props.bgColor : "#5F6FEE")};
  padding: ${props =>
    props.borderColor
      ? `${responsiveFontSize(1.7)}px ${responsiveFontSize(1.9)}px`
      : `${responsiveFontSize(1.6)}px ${responsiveFontSize(2)}px`};
  border: ${props =>
    props.borderColor
      ? `1px solid ${props.borderColor}`
      : `1px solid transparent`};
`;

const ButtonText = styled(MyText)`
  font-size: ${responsiveFontSize(1.9)};
  padding-left: 6px;
  color: ${props => (props.color ? props.color : "white")};
`;

const Button = props => {
  if (Platform.OS === "android") {
    return (
      <View
        style={{
          borderRadius: 10,
          overflow: "hidden"
        }}
        opacity={props.disabled === "true" ? 0.3 : 1}
      >
        <TouchableNativeFeedback
          disabled={props.disabled === "true"}
          background={TouchableNativeFeedback.Ripple(
            "rgba(255,255,255,0.6)",
            false
          )}
          onPress={props.onPress}
          useForeground={true}
        >
          <ButtonView bgColor={props.bgColor} borderColor={props.borderColor}>
            {props.children}
            <ButtonText color={props.color}> {props.text} </ButtonText>
          </ButtonView>
        </TouchableNativeFeedback>
      </View>
    );
  } else if (Platform.OS === "ios") {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <ButtonView bgColor={props.bgColor}>
          {props.children}
          <ButtonText color={props.color}> {props.text} </ButtonText>
        </ButtonView>
      </TouchableOpacity>
    );
  }
};

export default Button;
