import React from "react";
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from "react-native";
import { MyText } from "../styles";
import styled from "styled-components";

const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.bgColor ? props.bgColor : "#5F6FEE")};
  padding: ${props => (props.borderColor ? "14px 19px" : "15px 20px")};
  border-radius: 10px;
  border: ${props =>
    props.borderColor
      ? `1px solid ${props.borderColor}`
      : `1px solid transparent`};
`;

const ButtonText = styled(MyText)`
  font-size: 18;
  padding-left: 6px;
  color: ${props => (props.color ? props.color : "white")};
`;

const Button = props => {
  return (
    <View
      style={{ borderRadius: 10, backgroundColor: "rgba(255,255,255,0)" }}
      opacity={props.disabled === "true" ? 0.3 : 1}
    >
      {Platform.OS === "android" && (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(
            "rgba(255,255,255,0.8)",
            true
          )}
          onPress={props.onPress}
        >
          <ButtonView bgColor={props.bgColor} borderColor={props.borderColor}>
            {props.children}
            <ButtonText color={props.color}> {props.text} </ButtonText>
          </ButtonView>
        </TouchableNativeFeedback>
      )}

      {Platform.OS === "ios" && (
        <TouchableOpacity onPress={props.onPress}>
          <ButtonView bgColor={props.bgColor}>
            {props.children}
            <ButtonText color={props.color}> {props.text} </ButtonText>
          </ButtonView>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Button;
