import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import Button from "../components/Button";
import { LinearGradient } from "expo";
import { Entypo } from "@expo/vector-icons";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 140;
`;

class HomeScreen extends React.Component {
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
          <Button bgColor={"#23CF5F"} text={"Log in with Spotify"}>
            <Entypo name="spotify-with-circle" size={24} color="white" />
          </Button>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default HomeScreen;
