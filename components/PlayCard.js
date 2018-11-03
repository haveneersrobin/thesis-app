import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";

const SongView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  border-radius: 10;
  background-color: white;
  padding: 10px 10px;
  margin: 5px 0px;
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

const PlayImageView = styled(View)`
  padding-right: 10px;
  position: absolute;
`;

const MaskedImage = styled(Image)`
  border-radius: 10;
  margin-right: 10px;
`;

const CustomText = styled(Text)`
  font-size: 18;
`;

const ArtistText = styled(CustomText)`
  font-family: "roboto-black";
`;

const TitleText = styled(CustomText)`
  font-family: "roboto-regular";
`;

const ButtonView = styled(View)`
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const PlayCard = props => {
  return (
    <SongView elevation={2}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <ImageView>
          <MaskedImage
            style={{ width: 65, height: 65 }}
            source={{
              uri: props.image.url || undefined
            }}
          />
          <PlayImageView>
            <Image
              style={{ width: 50, height: 50 }}
              source={
                props.playing
                  ? require("../assets/img/pause.png")
                  : require("../assets/img/play.png")
              }
            />
          </PlayImageView>
        </ImageView>
      </TouchableWithoutFeedback>
      <TextView>
        <ArtistText>{props.artist}</ArtistText>
        <TitleText numberOfLines={1} width={100}>
          {props.name}
        </TitleText>
      </TextView>
      <ButtonView>
        <TouchableWithoutFeedback onPress={props.onLike}>
          <MaterialCommunityIcons name="thumb-up" size={24} color="#23CF5F" />
        </TouchableWithoutFeedback>
        <MaterialCommunityIcons name="thumb-down" size={24} color="#8360C3" />
      </ButtonView>
    </SongView>
  );
};

export default PlayCard;
