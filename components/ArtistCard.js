import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";
import { ellipsize } from "../utils";

const ArtistView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  padding-left: 25;
  padding-right: 25;
  margin-bottom: 20;
  ${props => props.first === "true" && `margin-top: 16px;`}
`;

const TextView = styled(View)`
  flex-direction: column;
  justify-content: center;
`;

const ImageView = styled(View)`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const LineContainer = styled(View)`
  flex-direction: row;
  flex: 1;
  align-items: center;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
  padding-top: 10;
  padding-bottom: 10;
  margin-left: 10;
  margin-right: 10;
`;

const ImageRound = styled(Image)`
  border-radius: 50;
  margin-right: 10px;
`;

const ArtistText = styled(Text)`
  font-family: "roboto-regular";
  padding-bottom: 2;
  font-size: 19;
`;

const FollowersText = styled(Text)`
  font-family: "roboto-regular";
  color: #757575;
  font-size: 17;
`;

const ArtistCard = props => {
  return (
    <TouchableWithoutFeedback onPress={props.addArtist}>
      <ArtistView
        elevation={2}
        first={props.index === 0 ? "true" : "false"}
        selected={props.selected}
      >
        <ImageView>
          <ImageRound
            style={{ width: 50, height: 50 }}
            source={
              props.image
                ? { uri: props.image }
                : require("../assets/img/profile.png")
            }
          />
        </ImageView>
        <LineContainer>
          <TextView>
            <ArtistText>{ellipsize(props.name)}</ArtistText>
            <FollowersText>Followers: {props.followers}</FollowersText>
          </TextView>
        </LineContainer>
      </ArtistView>
    </TouchableWithoutFeedback>
  );
};

export default ArtistCard;
