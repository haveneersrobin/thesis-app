import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";

const SongView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  border-radius: 10;
  background-color: ${props => (props.selected ? "#e4f3dc" : "white")};
  padding: 10px 10px;
  margin: 8px 16px;
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

const IconView = styled(View)`
  padding: 3px;
`;

const CheckView = styled(IconView)`
  background-color: #cae7b9;
  border-radius: 50;
`;

const PlayCard = props => {
  return (
    <SongView
      elevation={2}
      first={props.index === 0 ? "true" : "false"}
      selected={props.selected}
    >
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
        {!props.selected && (
          <TouchableWithoutFeedback onPress={props.onLike}>
            <IconView>
              <MaterialIcons name="playlist-add" size={24} color="#23CF5F" />
            </IconView>
          </TouchableWithoutFeedback>
        )}
        {props.selected && (
          <CheckView>
            <MaterialIcons
              name="playlist-add-check"
              size={24}
              color="#23CF5F"
            />
          </CheckView>
        )}

        <IconView>
          <MaterialIcons name="delete-forever" size={24} color="#8360C3" />
        </IconView>
      </ButtonView>
    </SongView>
  );
};

export default PlayCard;
