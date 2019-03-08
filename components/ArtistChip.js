import React, { Component } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import styled from "styled-components";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions";
import { MyText } from "../styles";

const window = Dimensions.get("window");

const MaskedImage = styled(Image)`
  border-radius: 50;
`;

const ChipView = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #d3d8fe;
  border-radius: 200;
  padding-top: 4;
  padding-bottom: 4;
  padding-left: 4;
  padding-right: 4;
  width: ${window.width / 2 - responsiveHeight(1.3)};
  margin: ${responsiveHeight(1.3)}px ${responsiveHeight(1.3)}px;
  ${props =>
    props.selected
      ? `border: 2px solid #5f6fee}`
      : `border: 2px solid transparent}`};
`;

const ArtistText = styled(MyText)`
  color: #5f6fee;
  font-size: ${responsiveFontSize(1.9)};
  text-align: center;
  font-family: "roboto-bold";
`;

const ArtistTextView = styled(View)`
  width: ${window.width / 2 - responsiveHeight(10)}px;
  padding-left: 8;
  padding-right: 12;
  justify-content: center;
  align-content: center;
  flex-direction: row;
`;

class ArtistChip extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let imageSource;
    if (this.props.selected) imageSource = require("../assets/img/check.png");
    else if (this.props.image !== undefined)
      imageSource = { uri: this.props.image.url };
    else imageSource = require("../assets/img/profile.png");

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress(this.props.id)}
      >
        <ChipView selected={this.props.selected === "true"}>
          <MaskedImage
            style={{ width: responsiveHeight(8), height: responsiveHeight(8) }}
            source={imageSource}
          />
          <ArtistTextView>
            <ArtistText numberOfLines={2}>{this.props.name}</ArtistText>
          </ArtistTextView>
        </ChipView>
      </TouchableWithoutFeedback>
    );
  }
}

export default ArtistChip;
