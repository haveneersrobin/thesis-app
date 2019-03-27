import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated
} from "react-native";

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions";

import styled from "styled-components";
import Button from "../components/Button";
import CustomMultiSlider from "../components/CustomMultiSlider";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather
} from "@expo/vector-icons";

import FlashMessage from "react-native-flash-message";

const SliderText = styled(Text)`
  font-size: ${responsiveFontSize(1.5)};
  padding-top: 5;
  padding-bottom: 5;
  margin-left: 10;
  color: #5f6fee;
  font-family: "roboto-bold";
  letter-spacing: 1px;
`;

const ScrollContainer = styled(View)`
  max-height: ${responsiveHeight(69)};
`;

const ModalButtons = styled(View)`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: ${responsiveHeight(3)};
`;

const SliderContainer = styled(View)`
  flex-direction: column;
  justify-content: center;
  margin-top: ${responsiveHeight(2)};
`;

const TextView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50;
  overflow: hidden;
  background-color: #e4e4e4;
  padding-top: ${responsiveHeight(1)};
  padding-bottom: ${responsiveHeight(1)};
`;

const TitleText = styled(Text)`
  text-align: center;
  font-size: ${responsiveFontSize(2.6)};
  font-family: "roboto-black";
  border-bottom-color: #e0e0e0;
  border-bottom-width: 2px;
  padding-top: ${responsiveHeight(1)};
  padding-bottom: ${responsiveHeight(2)};
`;

const SliderView = styled(View)``;

const TitleView = styled(View)``;

class FeaturesSliders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acousticness: this.props.acousticness || [0, 100],
      instrumentalness: this.props.instrumentalness || [0, 100],
      danceability: this.props.danceability || [0, 100],
      valence: this.props.valence || [0, 100],
      energy: this.props.energy || [0, 100],
      visible: new Animated.Value(0)
    };

    this.paramsChange = this.paramsChange.bind(this);
    this.showParameterInfo = this.showParameterInfo.bind(this);
  }

  paramsChange(key, values) {
    this.setState({ [key]: values });
  }
  componentDidMount() {
    Animated.timing(this.state.visible, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(() => {});
  }

  componentWillUnmount() {
    Animated.timing(this.state.visible, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {});
  }

  showParameterInfo(info, parameter) {
    this.refs.flashMessage.showMessage({
      message: `What is '${parameter}' ?`,
      description: `${info}\n(Tap this message to dismiss)`,
      type: "info",
      backgroundColor: "#5f6fee",
      color: "white"
    });
  }

  render() {
    return (
      <Animated.View style={{ opacity: this.state.visible }}>
        <TitleView>
          <TitleText>Adjust parameters</TitleText>
        </TitleView>
        <ScrollContainer>
          <ScrollView>
            <SliderContainer>
              <TouchableOpacity
                onPress={() =>
                  this.showParameterInfo(
                    "A confidence measure of whether the track is acoustic. 100 represents high confidence the track is acoustic (so, not electronic).",
                    "acousticness"
                  )
                }
              >
                <TextView>
                  <MaterialCommunityIcons
                    name="guitar-acoustic"
                    size={responsiveFontSize(2.4)}
                    color="#5f6fee"
                  />
                  <SliderText>ACOUSTICNESS</SliderText>
                </TextView>
              </TouchableOpacity>
              <SliderView>
                <CustomMultiSlider
                  values={this.state.acousticness}
                  onValuesChangeFinish={values =>
                    this.paramsChange("acousticness", values)
                  }
                />
              </SliderView>
            </SliderContainer>

            <SliderContainer>
              <TouchableOpacity
                onPress={() =>
                  this.showParameterInfo(
                    "Predicts whether a track contains no vocals. Rap or spoken word tracks, for example, are very “vocal” and so not instrumental.",
                    "instrumentalness"
                  )
                }
              >
                <TextView>
                  <MaterialCommunityIcons
                    name="voice"
                    size={responsiveFontSize(2.4)}
                    color="#5f6fee"
                  />
                  <SliderText>INSTRUMENTALNESS</SliderText>
                </TextView>
              </TouchableOpacity>
              <SliderView>
                <CustomMultiSlider
                  values={this.state.instrumentalness}
                  onValuesChangeFinish={values =>
                    this.paramsChange("instrumentalness", values)
                  }
                />
              </SliderView>
            </SliderContainer>

            <SliderContainer>
              <TouchableOpacity
                onPress={() =>
                  this.showParameterInfo(
                    "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.",
                    "danceability"
                  )
                }
              >
                <TextView>
                  <MaterialCommunityIcons
                    name="shoe-heel"
                    size={responsiveFontSize(2.4)}
                    color="#5f6fee"
                  />
                  <SliderText>DANCEABILITY</SliderText>
                </TextView>
              </TouchableOpacity>
              <SliderView>
                <CustomMultiSlider
                  values={this.state.danceability}
                  onValuesChangeFinish={values =>
                    this.paramsChange("danceability", values)
                  }
                />
              </SliderView>
            </SliderContainer>

            <SliderContainer>
              <TouchableOpacity
                onPress={() =>
                  this.showParameterInfo(
                    "A measure describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
                    "valence"
                  )
                }
              >
                <TextView>
                  <MaterialIcons
                    name="sentiment-neutral"
                    size={responsiveFontSize(2.4)}
                    color="#5f6fee"
                  />
                  <SliderText>VALENCE</SliderText>
                </TextView>
              </TouchableOpacity>
              <SliderView>
                <CustomMultiSlider
                  values={this.state.valence}
                  onValuesChangeFinish={values =>
                    this.paramsChange("valence", values)
                  }
                />
              </SliderView>
            </SliderContainer>

            <SliderContainer style={{ marginBottom: responsiveHeight(4) }}>
              <TouchableOpacity
                onPress={() =>
                  this.showParameterInfo(
                    "Energy is a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale.",
                    "energy"
                  )
                }
              >
                <TextView>
                  <SimpleLineIcons
                    name="energy"
                    size={responsiveFontSize(2.4)}
                    color="#5f6fee"
                  />
                  <SliderText>ENERGY</SliderText>
                </TextView>
              </TouchableOpacity>
              <SliderView>
                <CustomMultiSlider
                  values={this.state.energy}
                  onValuesChangeFinish={values =>
                    this.paramsChange("energy", values)
                  }
                />
              </SliderView>
            </SliderContainer>
          </ScrollView>
        </ScrollContainer>
        <ModalButtons>
          <Button
            bgColor={"white"}
            borderColor={"#5F6FEE"}
            color={"#5F6FEE"}
            text={"Cancel"}
            onPress={this.props.onCancel}
          >
            <MaterialIcons
              name="cancel"
              size={responsiveFontSize(2.4)}
              color="#5F6FEE"
            />
          </Button>
          <Button
            text={"Confirm"}
            onPress={() => this.props.onConfirm(this.state)}
          >
            <Feather
              name="check-circle"
              size={responsiveFontSize(2.4)}
              color="white"
            />
          </Button>
        </ModalButtons>
        <FlashMessage
          ref="flashMessage"
          position="bottom"
          animated={true}
          autoHide={false}
          floating={true}
        />
      </Animated.View>
    );
  }
}

export default FeaturesSliders;
