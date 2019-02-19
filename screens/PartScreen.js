import React, { Component } from "react";
import { View, Text } from "react-native";
import styled from "styled-components";
import Button from "../components/Button";
import { Feather } from "@expo/vector-icons";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-top: 30;
  padding-bottom: 20;
  background-color: #f2f2f2;
`;
const TitleContainer = styled(View)`
  padding-top: 20;
  flex: 7;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const FinishContainer = styled(View)`
  padding-top: 20;
  flex: 7;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled(Text)`
  font-size: 76;
  font-family: "roboto-regular";
`;

const SubTitle = styled(Text)`
  font-size: 26;
  font-family: "roboto-light";
`;

const ButtonView = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

class PartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.continue = this.continue.bind(this);
  }

  continue() {
    this.props.navigation.navigate("PickArtist", {
      step: this.props.navigation.getParam("part", undefined),
      artists: this.props.navigation.getParam("artists", undefined)
    });
  }

  render() {
    const part = this.props.navigation.getParam("part", 1);
    return (
      <StyledView>
        {part === 1 && (
          <View>
            <TitleContainer>
              <TitleText>Part 1</TitleText>
              <SubTitle>Control: artists + sliders</SubTitle>
            </TitleContainer>
            <ButtonView>
              <Button text="Start" onPress={this.continue}>
                <Feather name="arrow-right-circle" size={24} color="white" />
              </Button>
            </ButtonView>
          </View>
        )}

        {part === 2 && (
          <View>
            <TitleContainer>
              <TitleText>Part 2</TitleText>
              <SubTitle>Control: artists</SubTitle>
            </TitleContainer>
            <ButtonView>
              <Button text="Start" onPress={this.continue}>
                <Feather name="arrow-right-circle" size={24} color="white" />
              </Button>
            </ButtonView>
          </View>
        )}

        {part === 3 && (
          <View>
            <FinishContainer>
              <TitleText>That's all !</TitleText>
              <SubTitle>Thank you for participating.</SubTitle>
            </FinishContainer>
          </View>
        )}
      </StyledView>
    );
  }
}

export default PartScreen;
