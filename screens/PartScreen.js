import React, { Component } from "react";
import { View, Text, BackHandler, Alert, Image } from "react-native";
import styled from "styled-components";
import Button from "../components/Button";
import { Feather } from "@expo/vector-icons";
import { AndroidBackHandler } from "react-navigation-backhandler";
import {
  responsiveFontSize,
  responsiveHeight
} from "react-native-responsive-dimensions";

import Swiper from "react-native-swiper";

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
  font-size: ${responsiveFontSize(5)};
  font-family: "roboto-regular";
`;

const SubTitle = styled(Text)`
  font-size: ${responsiveFontSize(3)};
  font-family: "roboto-light";
  text-align: center;
`;

const ButtonView = styled(View)`
  align-items: center;
  justify-content: flex-end;
`;

const Slide = styled(View)`
  flex: 1;
  padding-left: 100px;
  padding-right: 100px;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const SlideImage = styled(Image)`
  flex: 1;
  border-radius: 8px;
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
        {part != 3 && (
          <View>
            <TitleContainer>
              <TitleText>{part == 1 ? "Part 1" : "Part 2"}</TitleText>
              <SubTitle>
                {version == "A"
                  ? part == 1
                    ? "Scrutable (control + explanations)"
                    : "Control only"
                  : part == 1
                  ? "Control only"
                  : "Scrutable (control + explanations)"}
              </SubTitle>
            </TitleContainer>

            {((version == "A" && part == "1") ||
              (version == "B" && part == "2")) && (
              <Swiper
                showsButtons={true}
                loop={false}
                buttonWrapperStyle={{
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  flex: 1,
                  paddingHorizontal: 0,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                style={{
                  paddingRight: 400,
                  marginBottom: responsiveHeight(2),
                  marginTop: responsiveHeight(2)
                }}
              >
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/1.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/2.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/3.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/4.png")}
                  />
                </Slide>

                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/5.png")}
                  />
                </Slide>

                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/6.png")}
                  />
                </Slide>
              </Swiper>
            )}

            {((version == "A" && part == "2") ||
              (version == "B" && part == "1")) && (
              <Swiper
                showsButtons={true}
                loop={false}
                buttonWrapperStyle={{
                  backgroundColor: "transparent",
                  flexDirection: "row",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  flex: 1,
                  paddingHorizontal: 0,
                  paddingVertical: 10,
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
                style={{
                  paddingRight: 400,
                  marginBottom: responsiveHeight(2),
                  marginTop: responsiveHeight(2)
                }}
              >
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/1.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/2B.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/3B.png")}
                  />
                </Slide>
                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/4.png")}
                  />
                </Slide>

                <Slide>
                  <SlideImage
                    resizeMode="contain"
                    source={require("../assets/img/tutorial/6B.png")}
                  />
                </Slide>
              </Swiper>
            )}
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
