import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  Animated
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
  flex-wrap: wrap;
  align-items: center;
  padding-left: 15;
  padding-right: 15;
  margin-top: 5;
  margin-bottom: 5;
  ${props => props.first === "true" && `margin-top: 25 !important;`}
`;

const TextView = styled(View)`
  flex-direction: column;
  justify-content: center;
  width: ${responsiveWidth(52)};
`;

const ImageView = styled(View)`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const LineContainer = styled(View)`
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
  margin-bottom: 17;
  margin-left: 80;
`;

const MaskedImage = styled(Image)`
  border-radius: 60;
  margin-right: 10px;
`;

const ArtistText = styled(Text)`
  font-family: "roboto-regular";
  padding-bottom: 2;
  font-size: ${responsiveFontSize(2.2)};
  width: ${responsiveWidth(52)};
`;

const TitleText = styled(Text)`
  font-family: "roboto-regular";
  color: #757575;
  font-size: ${responsiveFontSize(1.9)};
  width: ${responsiveWidth(52)};
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

const FeatureView = styled(View)`
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
`;

const FeatureText = styled(Text)`
  text-align: center;
  font-family: "roboto-regular";
  font-size: ${responsiveFontSize(1.5)};
`;

const FeatureKey = styled(Text)`
  text-align: center;
  padding-bottom: 3px;
  padding-top: 8px;
  color: #5f6fee;
  font-family: "roboto-bold";
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: ${responsiveFontSize(1.3)};
`;

const FeatureContainer = styled(Animated.View)`
  border: 1px solid #eeeeee;
  border-radius: 8px;
  margin-left: 63px;
  margin-top: 10px;
  margin-right: 40px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 15px;
`;

class PlayCard extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false, textOpacity: new Animated.Value(0) };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.changeLayout = this.changeLayout.bind(this);
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.expanded) {
      Animated.timing(this.state.textOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(this.state.textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
      <View>
        <SongView
          first={this.props.index === 0 ? "true" : "false"}
          selected={this.props.selected}
          style={{
            height: this.state.expanded ? null : 70,
            overflow: "hidden"
          }}
        >
          <ImageView>
            <MaskedImage
              style={{
                width: responsiveHeight(6.3),
                height: responsiveHeight(6.3)
              }}
              source={{
                uri: this.props.image.url || undefined
              }}
            />
          </ImageView>
          <TextView>
            <ArtistText numberOfLines={1}>{this.props.artist}</ArtistText>
            <TitleText numberOfLines={1}>{this.props.name}</TitleText>
          </TextView>
          <ButtonView>
            <TouchableOpacity
              hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
              onPress={this.changeLayout}
            >
              <IconView style={{ marginRight: 10 }}>
                <Ionicons
                  name={
                    this.state.expanded
                      ? "md-arrow-dropup-circle"
                      : "md-information-circle"
                  }
                  size={32}
                  color="#D3D3D3"
                />
              </IconView>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
              onPress={this.props.onPress}
            >
              <Image
                style={{
                  width: responsiveHeight(4.9),
                  height: responsiveHeight(4.9),
                  marginRight: responsiveWidth(2)
                }}
                source={
                  this.props.playing
                    ? require("../assets/img/pause2-bl.png")
                    : require("../assets/img/play2-bl.png")
                }
              />
            </TouchableOpacity>
            {!this.props.selected && (
              <TouchableOpacity
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                onPress={this.props.onLike}
              >
                <IconView>
                  <MaterialIcons
                    name="playlist-add"
                    size={24}
                    color="#5f6fee"
                  />
                </IconView>
              </TouchableOpacity>
            )}
            {this.props.selected && (
              <TouchableOpacity
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                onPress={this.props.onLike}
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
          <FeatureContainer
            style={{
              opacity: this.state.textOpacity
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-end"
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%"
                }}
              >
                <FeatureView>
                  <FeatureKey>ACOUSTICNESS</FeatureKey>
                  <FeatureText>{this.props.features.acousticness}</FeatureText>
                </FeatureView>

                <FeatureView>
                  <FeatureKey>DANCEABILITY</FeatureKey>
                  <FeatureText>
                    {this.props.features.instrumentalness}
                  </FeatureText>
                </FeatureView>

                <FeatureView>
                  <FeatureKey>INSTRUMENTALNESS</FeatureKey>
                  <FeatureText>{this.props.features.danceability}</FeatureText>
                </FeatureView>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "50%"
                }}
              >
                <FeatureView>
                  <FeatureKey>VALENCE</FeatureKey>
                  <FeatureText>{this.props.features.valence}</FeatureText>
                </FeatureView>

                <FeatureView>
                  <FeatureKey>ENERGY</FeatureKey>
                  <FeatureText>{this.props.features.energy}</FeatureText>
                </FeatureView>
              </View>
            </View>
          </FeatureContainer>
        </SongView>
        <LineContainer />
      </View>
    );
  }
}

export default PlayCard;
