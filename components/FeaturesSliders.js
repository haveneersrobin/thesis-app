import React, { Component } from "react";
import { View, Text } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { responsiveFontSize } from "react-native-responsive-dimensions";

import styled from "styled-components";
import Button from "../components/Button";

const SliderText = styled(Text)`
  font-family: "sans-bold";
  font-size: ${responsiveFontSize(2)};
  margin: 10px 0px;
`;

const ModalButtons = styled(View)`
  align-self: stretch;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
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
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SliderText>Acousticness</SliderText>
          <MultiSlider
            values={this.state.acousticness}
            onValuesChangeFinish={values =>
              this.paramsChange("acousticness", values)
            }
            sliderLength={300}
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            markerStyle={{ backgroundColor: "#5F6FEE" }}
            selectedStyle={{ backgroundColor: "#5F6FEE" }}
            containerStyle={{ marginRight: 10, marginLeft: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SliderText>Instrumentalness</SliderText>
          <MultiSlider
            values={this.state.instrumentalness}
            sliderLength={300}
            onValuesChangeFinish={values =>
              this.paramsChange("instrumentalness", values)
            }
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            markerStyle={{ backgroundColor: "#5F6FEE" }}
            selectedStyle={{ backgroundColor: "#5F6FEE" }}
            containerStyle={{ marginRight: 10, marginLeft: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SliderText>Danceability</SliderText>
          <MultiSlider
            values={this.state.danceability}
            sliderLength={300}
            min={0}
            max={100}
            onValuesChangeFinish={values =>
              this.paramsChange("danceability", values)
            }
            step={1}
            allowOverlap={false}
            snapped
            markerStyle={{ backgroundColor: "#5F6FEE" }}
            selectedStyle={{ backgroundColor: "#5F6FEE" }}
            containerStyle={{ marginRight: 10, marginLeft: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SliderText>Valence</SliderText>
          <MultiSlider
            values={this.state.valence}
            sliderLength={300}
            onValuesChangeFinish={values =>
              this.paramsChange("valence", values)
            }
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            markerStyle={{ backgroundColor: "#5F6FEE" }}
            selectedStyle={{ backgroundColor: "#5F6FEE" }}
            containerStyle={{ marginRight: 10, marginLeft: 10 }}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <SliderText>Energy</SliderText>
          <MultiSlider
            values={this.state.energy}
            sliderLength={300}
            onValuesChangeFinish={values => this.paramsChange("energy", values)}
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            markerStyle={{ backgroundColor: "#5F6FEE" }}
            selectedStyle={{ backgroundColor: "#5F6FEE" }}
            containerStyle={{ marginRight: 10, marginLeft: 10 }}
          />
        </View>
        <ModalButtons>
          <Button
            bgColor={"white"}
            borderColor={"#5F6FEE"}
            color={"#5F6FEE"}
            text={"Cancel"}
            onPress={this.props.onCancel}
          />
          <Button
            text={"Confirm"}
            onPress={() => this.props.onConfirm(this.state)}
          />
        </ModalButtons>
      </View>
    );
  }
}

export default FeaturesSliders;
