import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components";

import { LinearGradient } from "expo";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 140;
`;

class PickArtistScreen extends React.Component {
  render() {
    return (
      <LinearGradient
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%"
        }}
        start={[1, 0]}
        end={[0, 1]}
        colors={["#8360C3", "rgba(46, 191, 145, 0.4)"]}
      >
        <StyledView>
          <Text>Hello</Text>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default PickArtistScreen;
