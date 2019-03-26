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
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons
} from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

import _ from "lodash";

import Analytics from "../Analytics";
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
  justify-content: space-between;
  width: ${responsiveWidth(46)};
`;

const ImageView = styled(View)`
  position: relative;
  align-items: center;
  justify-content: center;
  ${props =>
    props.selected
      ? `border: 3px solid #88a9fc;`
      : `border: 3px solid transparent;`}
  border-radius: 30;
  overflow: hidden;
  margin-right: 10px;
`;

const LineContainer = styled(View)`
  border-bottom-color: #e5e5e5;
  border-bottom-width: 1px;
  margin-bottom: 17;
  margin-left: 80;
`;

const MaskedImage = styled(Image)`
  border-radius: 30;
`;

const ArtistText = styled(Text)`
  font-family: "roboto-medium";
  padding-bottom: 2;
  font-size: ${responsiveFontSize(2.3)};
  width: ${responsiveWidth(46)};
`;

const TitleText = styled(Text)`
  font-family: "roboto-regular";
  color: #757575;
  font-size: ${responsiveFontSize(1.8)};
  width: ${responsiveWidth(46)};
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
  padding: ${responsiveHeight(0.5)}px;
`;

const FeatureView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-self: flex-end;
  align-items: center;
  margin-bottom: 13px;
`;

const FeatureKeyContainer = styled(View)`
  flex-direction: row;
  align-self: flex-end;
  justify-content: center;
  align-items: center;
  background-color: #e4e4e4;
  padding: 5px 12px;
  border-radius: 50;
`;

const FeatureText = styled(Text)`
  text-align: right;
  font-family: "roboto-bold";
  font-size: ${responsiveFontSize(1.9)};
  color: ${props => (props.inInterval ? "green" : "red")};
`;

const FeatureKey = styled(Text)`
  text-align: center;
  color: #5f6fee;
  font-family: "roboto-bold";
  letter-spacing: 1px;
  font-size: ${responsiveFontSize(1.3)};
  margin-left: 12px;
`;

const FeatureContainer = styled(Animated.View)`
  flex-direction: column;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 60px;
  padding-top: 12px;
  padding-left: 30px;
  padding-right: 20px;
  width: auto;
`;

const FeatureTextView = styled(View)`
  width: 20%;
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
    if (!this.state.expanded) {
      Analytics.track(Analytics.events.SEE_SONG_FEATURES, {
        song: `${this.props.artist} - ${this.props.name}`
      });
    }
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
          style={{
            height: this.state.expanded ? null : 70,
            overflow: "hidden"
          }}
        >
          <ImageView selected={this.props.selected}>
            <MaskedImage
              style={{
                width: responsiveHeight(6),
                height: responsiveHeight(6)
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
            {this.props.showInfo && (
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
            )}
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
                    size={26}
                    color="#cccccc"
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
                    size={26}
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
                flexDirection: "column"
              }}
            >
              <FeatureView>
                <FeatureKeyContainer>
                  <MaterialCommunityIcons
                    name="guitar-acoustic"
                    size={20}
                    color="#5f6fee"
                  />
                  <FeatureKey>ACOUSTICNESS</FeatureKey>
                </FeatureKeyContainer>

                <FeatureTextView>
                  <FeatureText
                    noPadding={true}
                    inInterval={
                      this.props.features.acousticness >=
                        this.props.sliders.acousticness[0] &&
                      this.props.features.acousticness <=
                        this.props.sliders.acousticness[1]
                    }
                  >
                    {this.props.features.acousticness}
                  </FeatureText>
                </FeatureTextView>
              </FeatureView>

              <FeatureView>
                <FeatureKeyContainer>
                  <MaterialCommunityIcons
                    name="voice"
                    size={20}
                    color="#5f6fee"
                  />
                  <FeatureKey>INSTRUMENTALNESS</FeatureKey>
                </FeatureKeyContainer>

                <FeatureTextView>
                  <FeatureText
                    inInterval={
                      this.props.features.instrumentalness >=
                        this.props.sliders.instrumentalness[0] &&
                      this.props.features.instrumentalness <=
                        this.props.sliders.instrumentalness[1]
                    }
                  >
                    {this.props.features.instrumentalness}
                  </FeatureText>
                </FeatureTextView>
              </FeatureView>

              <FeatureView>
                <FeatureKeyContainer>
                  <MaterialCommunityIcons
                    name="shoe-heel"
                    size={20}
                    color="#5f6fee"
                  />
                  <FeatureKey>DANCEABILITY</FeatureKey>
                </FeatureKeyContainer>

                <FeatureTextView>
                  <FeatureText
                    inInterval={
                      this.props.features.danceability >=
                        this.props.sliders.danceability[0] &&
                      this.props.features.danceability <=
                        this.props.sliders.danceability[1]
                    }
                  >
                    {this.props.features.danceability}
                  </FeatureText>
                </FeatureTextView>
              </FeatureView>

              <FeatureView>
                <FeatureKeyContainer>
                  <MaterialIcons
                    name="sentiment-neutral"
                    size={20}
                    color="#5f6fee"
                  />
                  <FeatureKey>VALENCE</FeatureKey>
                </FeatureKeyContainer>

                <FeatureTextView>
                  <FeatureText
                    inInterval={
                      this.props.features.valence >=
                        this.props.sliders.valence[0] &&
                      this.props.features.valence <=
                        this.props.sliders.valence[1]
                    }
                  >
                    {this.props.features.valence}
                  </FeatureText>
                </FeatureTextView>
              </FeatureView>

              <FeatureView>
                <FeatureKeyContainer>
                  <SimpleLineIcons name="energy" size={20} color="#5f6fee" />
                  <FeatureKey>ENERGY</FeatureKey>
                </FeatureKeyContainer>
                <FeatureTextView>
                  <FeatureText
                    inInterval={
                      this.props.features.energy >=
                        this.props.sliders.energy[0] &&
                      this.props.features.energy <= this.props.sliders.energy[1]
                    }
                  >
                    {this.props.features.energy}
                  </FeatureText>
                </FeatureTextView>
              </FeatureView>
            </View>
          </FeatureContainer>
        </SongView>
        <LineContainer />
      </View>
    );
  }
}

export default PlayCard;
