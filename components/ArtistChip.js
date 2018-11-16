import React, { Component } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import styled from "styled-components";
import { MyText } from "../styles";

import { responsiveFontSize } from "react-native-responsive-dimensions";
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
  margin: 10px;
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
  padding: 0px 8px;
  font-family: "sans-semibold";
`;

class ArtistChip extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress(this.props.id)}
      >
        <ChipView selected={this.props.selected === "true"}>
          <MaskedImage
            style={{ width: 60, height: 60 }}
            source={
              this.props.selected
                ? require("../assets/img/check.png")
                : { uri: this.props.image.url }
            }
          />
          <View style={{ width: window.width / 2 - 100 }}>
            <ArtistText numberOfLines={2}>{this.props.name}</ArtistText>
          </View>
        </ChipView>
      </TouchableWithoutFeedback>
    );
  }
}

export default ArtistChip;
