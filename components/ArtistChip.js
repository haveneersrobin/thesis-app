import React, { Component } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import styled from "styled-components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { MyText } from "../styles";

const window = Dimensions.get("window");

const MaskedImage = styled(Image)`
  border-radius: 30;
`;

const ChipView = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #d3d8fe;
  border-radius: 80;
  padding: 4px 5px;
  width: ${window.width / 2 - 25};
  margin: 15px 15px;
  ${props =>
    props.selected
      ? `border: 2px solid #5f6fee}`
      : `border: 2px solid transparent}`};
`;

const ArtistText = styled(MyText)`
  color: #5f6fee;
  font-size: ${responsiveFontSize(1.9)};
  text-align: center;
  margin-left: -6px;
  padding: 0px 12px;
  font-family: "roboto-bold";
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
          <MaskedImage style={{ width: 60, height: 60 }} source={imageSource} />
          <View style={{ width: window.width / 2 - 100 }}>
            <ArtistText numberOfLines={2}>{this.props.name}</ArtistText>
          </View>
        </ChipView>
      </TouchableWithoutFeedback>
    );
  }
}

export default ArtistChip;
