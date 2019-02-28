import React, { Component } from "react";
import { View, Text } from "react-native";

import { responsiveFontSize } from "react-native-responsive-dimensions";

import styled from "styled-components";
import Button from "../components/Button";
import CustomMultiSlider from "../components/CustomMultiSlider";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather
} from "@expo/vector-icons";

const SliderText = styled(Text)`
  font-family: "roboto-medium";
  font-size: ${responsiveFontSize(1.5)};
  color: #616161;
  padding-top: 5;
  padding-bottom: 5;
  margin-left: 10;
`;

const ModalButtons = styled(View)`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 10;
`;

const SliderContainer = styled(View)`
  flex-direction: column;
  justify-content: center;
  margin-top: 15;
  margin-bottom: 15;
`;

const TextView = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50;
  overflow: hidden;
  background-color: #e4e4e4;
  padding-top: 5;
  padding-bottom: 5;
`;

const TitleText = styled(Text)`
  text-align: center;
  font-size: ${responsiveFontSize(2.6)};
  font-family: "roboto-black";
  border-bottom-color: #e0e0e0;
  border-bottom-width: 2px;
  padding-bottom: 15px;
`;

const SliderView = styled(View)`
  padding-left: 12px;
  padding-right: 12px;
`;

const TitleView = styled(View)`
  margin-bottom: 15;
  padding-top: 5;
`;

class FeaturesSliders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      acousticness: this.props.acousticness || [0, 100],
      instrumentalness: this.props.instrumentalness || [0, 100],
      danceability: this.props.danceability || [0, 100],
      valence: this.props.valence || [0, 100],
      energy: this.props.energy || [0, 100]
    };

    this.paramsChange = this.paramsChange.bind(this);
  }

  paramsChange(key, values) {
    this.setState({ [key]: values });
  }

  render() {
    return (
      <View>
        <TitleView>
          <TitleText>Adjust parameters</TitleText>
        </TitleView>
        <SliderContainer>
          <TextView>
            <MaterialCommunityIcons
              name="guitar-acoustic"
              size={22}
              color="#5f6fee"
            />
            <SliderText>Acousticness</SliderText>
          </TextView>
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
          <TextView>
            <MaterialCommunityIcons name="voice" size={22} color="#5f6fee" />
            <SliderText>Instrumentalness</SliderText>
          </TextView>
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
          <TextView>
            <MaterialCommunityIcons
              name="shoe-heel"
              size={22}
              color="#5f6fee"
            />
            <SliderText>Danceability</SliderText>
          </TextView>
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
          <TextView>
            <MaterialIcons name="sentiment-neutral" size={22} color="#5f6fee" />
            <SliderText>Valence</SliderText>
          </TextView>
          <SliderView>
            <CustomMultiSlider
              values={this.state.valence}
              onValuesChangeFinish={values =>
                this.paramsChange("valence", values)
              }
            />
          </SliderView>
        </SliderContainer>

        <SliderContainer style={{ marginBottom: 30 }}>
          <TextView>
            <SimpleLineIcons name="energy" size={22} color="#5f6fee" />
            <SliderText>Energy</SliderText>
          </TextView>
          <SliderView>
            <CustomMultiSlider
              values={this.state.energy}
              onValuesChangeFinish={values =>
                this.paramsChange("energy", values)
              }
            />
          </SliderView>
        </SliderContainer>

        <ModalButtons>
          <Button
            bgColor={"white"}
            borderColor={"#5F6FEE"}
            color={"#5F6FEE"}
            text={"Cancel"}
            onPress={this.props.onCancel}
          >
            <MaterialIcons name="cancel" size={24} color="#5F6FEE" />
          </Button>
          <Button
            text={"Confirm"}
            onPress={() => this.props.onConfirm(this.state)}
          >
            <Feather name="check-circle" size={24} color="white" />
          </Button>
        </ModalButtons>
      </View>
    );
  }
}

export default FeaturesSliders;
