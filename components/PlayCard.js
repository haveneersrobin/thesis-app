import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Image,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";
import styled from "styled-components";
import { ellipsize } from "../utils";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

const SongView = styled(View)`
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding-left: 15;
  padding-right: 15;
  ${props => props.first === "true" && `margin-top: 16px;`}
`;

const TextView = styled(View)`
  flex-direction: column;
  justify-content: center;
  width: ${responsiveWidth(55.5)};
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
  padding-top: 18;
  padding-bottom: 18;
  margin-left: 10;
  margin-right: 10;
`;

const MaskedImage = styled(Image)`
  border-radius: 60;
  margin-right: 10px;
`;

const ArtistText = styled(Text)`
  font-family: "roboto-regular";
  padding-bottom: 2;
  font-size: ${responsiveFontSize(2.2)};
`;

const TitleText = styled(Text)`
  font-family: "roboto-regular";
  color: #757575;
  font-size: ${responsiveFontSize(1.9)};
  width: ${responsiveWidth(55.5)};
`;

const ButtonView = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const IconView = styled(View)`
  padding: ${responsiveHeight(0.5)}px;
`;

const CheckView = styled(IconView)`
  background-color: #88a9fc;
  border-radius: 50;
  padding: ${responsiveHeight(0.5)}px;
`;

const PlayCard = props => {
  return (
    <SongView
      elevation={2}
      first={props.index === 0 ? "true" : "false"}
      selected={props.selected}
    >
      <ImageView>
        <MaskedImage
          style={{
            width: responsiveHeight(6.3),
            height: responsiveHeight(6.3)
          }}
          source={{
            uri: props.image.url || undefined
          }}
        />
      </ImageView>
      <LineContainer>
        <TextView>
          <ArtistText numberOfLines={1}>{ellipsize(props.artist)}</ArtistText>
          <TitleText numberOfLines={1}>{props.name}</TitleText>
        </TextView>
        <ButtonView>
          <TouchableOpacity
            hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
            onPress={props.onPress}
          >
            <Image
              style={{
                width: responsiveHeight(4.9),
                height: responsiveHeight(4.9),
                marginRight: responsiveWidth(2)
              }}
              source={
                props.playing
                  ? require("../assets/img/pause2-bl.png")
                  : require("../assets/img/play2-bl.png")
              }
            />
          </TouchableOpacity>
          {!props.selected && (
            <TouchableOpacity
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={props.onLike}
            >
              <IconView>
                <MaterialIcons name="playlist-add" size={24} color="#5f6fee" />
              </IconView>
            </TouchableOpacity>
          )}
          {props.selected && (
            <TouchableOpacity
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={props.onLike}
            >
              <CheckView>
                <MaterialIcons
                  name="playlist-add-check"
                  size={24}
                  color="#5f6fee"
                />
              </CheckView>
            </TouchableOpacity>
          )}
        </ButtonView>
      </LineContainer>
    </SongView>
  );
};

export default PlayCard;
