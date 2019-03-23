import React, { Component } from "react";
import { View, Text, BackHandler, Alert } from "react-native";
import styled from "styled-components";
import Button from "../components/Button";
import { Feather } from "@expo/vector-icons";
import { AndroidBackHandler } from "react-navigation-backhandler";
import {
  responsiveFontSize,
  responsiveHeight
} from "react-native-responsive-dimensions";

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
  font-size: ${responsiveFontSize(7)};
  font-family: "roboto-regular";
`;

const SubTitle = styled(Text)`
  font-size: ${responsiveFontSize(4)};
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
      version: this.props.navigation.getParam("version", undefined)
    });
  }

  onBackButtonPressAndroid = () => {
    Alert.alert("Confirm exit", "Do you want to quit the app?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Ok, exit.",
        onPress: () => BackHandler.exitApp()
      }
    ]);

    return true;
  };

  render() {
    const part = this.props.navigation.getParam("part", 1);
    const version = this.props.navigation.getParam("version", "A");
    return (
      <StyledView>
        <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid} />
        {part === 1 && (
          <View>
            <TitleContainer>
              <TitleText>Part 1</TitleText>
              <SubTitle>
                {version == "A"
                  ? "Control: artists + sliders"
                  : "Control: artists"}
              </SubTitle>
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
              <SubTitle>
                {version == "A"
                  ? "Control: artists"
                  : "Control: artists + sliders"}
              </SubTitle>
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
