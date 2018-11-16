import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";

const SongView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  border-radius: 8;
  background-color: #f8f8f8;
  border: ${props =>
    props.selected ? "2px solid #5f6fee" : "2px solid transparent"};
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
  font-family: "sans-semibold";
`;

const TitleText = styled(CustomText)`
  font-family: "sans-regular";
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
  background-color: #88a9fc;
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
              <MaterialIcons name="playlist-add" size={24} color="#5f6fee" />
            </IconView>
          </TouchableWithoutFeedback>
        )}
        {props.selected && (
          <TouchableWithoutFeedback onPress={props.onLike}>
            <CheckView>
              <MaterialIcons
                name="playlist-add-check"
                size={24}
                color="#5f6fee"
              />
            </CheckView>
          </TouchableWithoutFeedback>
        )}
        <IconView>
          <MaterialIcons name="delete-forever" size={24} color="#B3BAC8" />
        </IconView>
      </ButtonView>
    </SongView>
  );
};

export default PlayCard;
