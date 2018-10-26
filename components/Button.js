import React from "react";
import { View, Text } from "react-native";
import { MyText } from "../styles";
import styled from "styled-components";
import Ripple from "react-native-material-ripple";

const ButtonView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.bgColor ? props.bgColor : "#8360C3")};
  border-radius: 40px;
  padding: 12px 15px;
`;

const ButtonText = styled(MyText)`
  font-size: 18;
  padding-left: 6px;
  color: ${props => (props.color ? props.color : "white")};
`;

const Button = props => {
  return (
    <Ripple rippleContainerBorderRadius={40} rippleColor={"rgb(255, 255, 255)"}>
      <ButtonView bgColor={props.bgColor}>
        {props.children}
        <ButtonText> {props.text} </ButtonText>
      </ButtonView>
    </Ripple>
  );
};

export default Button;
