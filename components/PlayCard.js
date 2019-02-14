import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components";
import { ellipsize } from "../utils";

const SongView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  /*border-radius: 8;*/
  /*background-color: #f8f8f8;*/
  /*border: ${props =>
    props.selected ? "2px solid #5f6fee" : "2px solid transparent"};*/
  padding-left: 15;
  padding-right: 15;
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
  position: absolute;
  padding-top: 30px;
  padding-left: 30px;
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

const MaskedImage = styled(Image)`
  border-radius: 50;
  margin-right: 10px;
`;

const ArtistText = styled(Text)`
  font-family: "roboto-regular";
  padding-bottom: 2;
  font-size: 19;
`;

const TitleText = styled(Text)`
  font-family: "roboto-regular";
  color: #757575;
  font-size: 17;
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
            style={{ width: 50, height: 50 }}
            source={{
              uri: props.image.url || undefined
            }}
          />
          <PlayImageView>
            <Image
              style={{ width: 30, height: 30 }}
              source={
                props.playing
                  ? require("../assets/img/pause2-bl.png")
                  : require("../assets/img/play2-bl.png")
              }
            />
          </PlayImageView>
        </ImageView>
      </TouchableWithoutFeedback>
      <LineContainer>
        <TextView>
          <ArtistText>{ellipsize(props.artist)}</ArtistText>
          <TitleText>{ellipsize(props.name)}</TitleText>
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
      </LineContainer>
    </SongView>
  );
};

export default PlayCard;
