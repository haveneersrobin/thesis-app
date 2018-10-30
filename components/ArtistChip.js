import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";

import { MyText } from "../styles";

const MaskedImage = styled(Image)`
  border-radius: 50;
`;

const ChipView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #cae7b9;
  border-radius: 80;
  padding: 4px 5px;

  margin-top: ${props => (props.selected ? 10 : 12)};
  margin-bottom: ${props => (props.selected ? 10 : 12)};
  margin-left: ${props => (props.selected ? 5 : 7)};
  margin-right: ${props => (props.selected ? 5 : 7)};
  ${props => props.selected && `border: 2px solid #23CF5F}`};
`;

const ArtistText = styled(MyText)`
  color: white;
  font-size: 14;
  letter-spacing: 1;
  margin-left: 15;
  margin-right: 20;
  font-family: "roboto-black";
`;

const ArtistChip = props => {
  return (
    <TouchableWithoutFeedback onPress={() => props.onPress(props.id)}>
      <ChipView
        selected={props.selected === "true"}
        elevation={props.selected === "true" ? 6 : 4}
      >
        <MaskedImage
          style={{ width: 47, height: 47 }}
          source={
            props.selected
              ? require("../assets/img/check.png")
              : { uri: props.image.url }
          }
        />
        <ArtistText>{props.name}</ArtistText>
      </ChipView>
    </TouchableWithoutFeedback>
  );
};

export default ArtistChip;
