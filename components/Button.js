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
