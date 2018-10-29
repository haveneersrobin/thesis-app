import React from "react";
import { View, Text, Image } from "react-native";
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
  margin-top: 10;
  margin-bottom: 10;
  margin-right: 5;
  margin-left: 5;
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
    <ChipView>
      <MaskedImage
        style={{ width: 47, height: 47 }}
        source={{ uri: props.image.url }}
      />
      <ArtistText>{props.name}</ArtistText>
    </ChipView>
  );
};

export default ArtistChip;
