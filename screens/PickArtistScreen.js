import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableHighlight,
  StatusBar,
  Platform
} from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo";
import posed, { Transition } from "react-native-pose";
import * as Animatable from "react-native-animatable";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ArtistChip from "../components/ArtistChip";
import { ScrollView } from "react-native-gesture-handler";
import { MyText } from "../styles";
import Button from "../components/Button";
import { responsiveFontSize } from "react-native-responsive-dimensions";

import { SafeAreaView } from "react-navigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const MainContainer = styled(View)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;
  margin-left: 25px;
`;

const TitleText = styled(Text)`
  font-family: "sans-bold";
  font-size: ${responsiveFontSize(4)};
  color: black;
`;

const Border = styled(View)`
  border-bottom-color: #5f6fee;
  border-bottom-width: 5px;
  align-self: stretch;
  margin-right: 50px;
  margin-top: 7px;
  border-radius: 5px;
`;

const MiddleContainer = styled(View)`
  flex-direction: column;
  flex: 2;
  justify-content: flex-start;
  align-items: center;
`;

const SelectedContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;

const SelectionContainer = styled(View)`
  flex: 5;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ArtistsContainer = styled(Animatable.View)`
  flex-direction: row;
  flex: 3;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
`;

const NavContainer = styled(View)`
  flex: 2;
`;

const ButtonView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 200px;
`;

const NothingSelected = styled(Text)`
  color: rgba(0, 0, 0, 0.4);
  font-size: ${responsiveFontSize(1.4)};
  font-family: "sans-lightitalic";
`;

const SelectedText = styled(MyText)`
  color: #8b919d;
  font-size: 14;
  padding: 12px 10px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20;
`;

const BottomContainer = styled(View)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 45px;
`;

class PickArtistScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      fadeAnim: new Animated.Value(0), // init opacity 0
      selected: []
    };

    this._moveIndex = this._moveIndex.bind(this);
    this.nextIndex = this.nextIndex.bind(this);
    this.previousIndex = this.previousIndex.bind(this);
    this.resetIndex = this.resetIndex.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.continue = this.continue.bind(this);
  }

  _moveIndex(amount) {
    this.fadeIn();
    this.setState(prevState => ({
      index: (prevState.index += amount)
    }));
  }

  nextIndex() {
    this._moveIndex(6);
  }

  previousIndex() {
    this._moveIndex(-6);
  }

  resetIndex() {
    this.fadeIn();
    this.setState({ index: 0 });
  }

  toggleSelection(id) {
    let selectedValues = this.state.selected || [];
    const position = selectedValues.indexOf(id);
    if (position === -1) {
      selectedValues.push(id);
    } else {
      selectedValues.splice(position, 1);
    }
    this.setState({ selected: selectedValues });
  }

  continue() {
    if (this.state.selected.length > 0 && this.state.selected.length <= 5) {
      this.props.navigation.navigate("SongOverviewScreen", {
        artists: this.state.selected
      });
    }
  }

  handleViewRef = ref => (this.view = ref);
  fadeIn = () => this.view.fadeIn(800);

  render() {
    const { navigation } = this.props;
    const artists = navigation.getParam("artists", undefined);

    return (
      <SafeAreaView style={{ backgroundColor: "#f2f2f2", color: "black" }}>
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        />
        <MainContainer
          style={{
            paddingTop:
              Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight + 40
          }}
        >
          <TitleContainer>
            <TitleText>
              Pick up to 5 artists
              <Text style={{ fontSize: 45, color: "#5F6FEE" }}>.</Text>
            </TitleText>
            <Border />
          </TitleContainer>

          <MiddleContainer>
            <SelectedContainer>
              {this.state.selected.length !== 0 && (
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexGrow: 0
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  <MaterialIcons name="navigate-next" color="#8b919d" />
                  {this.state.selected.map(id => (
                    <SelectedText key={id}>
                      {artists.find(artist => artist.id === id).name}
                    </SelectedText>
                  ))}
                  <MaterialIcons
                    name="navigate-next"
                    color="#8b919d"
                    style={{ transform: [{ rotate: "-180deg" }] }}
                  />
                </ScrollView>
              )}
              {this.state.selected.length === 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Feather
                    name="info"
                    color="rgba(0, 0, 0, 0.4)"
                    style={{ marginRight: 8 }}
                  />
                  <NothingSelected>
                    Your selected artists will appear here.
                  </NothingSelected>
                </View>
              )}
            </SelectedContainer>

            <SelectionContainer>
              <ArtistsContainer ref={this.handleViewRef}>
                {artists &&
                  artists
                    .slice(this.state.index, this.state.index + 6)
                    .map(artist => (
                      <ArtistChip
                        onPress={this.toggleSelection}
                        id={artist.id}
                        key={artist.id}
                        selected={
                          this.state.selected.indexOf(artist.id) !== -1 &&
                          "true"
                        }
                        name={artist.name}
                        image={artist.images[artist.images.length - 2]}
                      />
                    ))}
              </ArtistsContainer>

              <NavContainer>
                {this.state.index === 0 && (
                  <TouchableHighlight onPress={this.nextIndex}>
                    <MaterialIcons
                      name="navigate-next"
                      size={35}
                      color="black"
                    />
                  </TouchableHighlight>
                )}
                {this.state.index > 0 &&
                  this.state.index <
                    (Math.ceil(artists.length / 6) - 1) * 6 && (
                    <ButtonView>
                      <TouchableOpacity onPress={this.previousIndex}>
                        <MaterialIcons
                          name="navigate-next"
                          size={35}
                          color="black"
                          style={{ transform: [{ rotate: "-180deg" }] }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.nextIndex}>
                        <MaterialIcons
                          name="navigate-next"
                          size={35}
                          color="black"
                        />
                      </TouchableOpacity>
                    </ButtonView>
                  )}
                {this.state.index ===
                  (Math.ceil(artists.length / 6) - 1) * 6 && (
                  <ButtonView>
                    <TouchableOpacity onPress={this.previousIndex}>
                      <MaterialIcons
                        name="navigate-next"
                        size={35}
                        color="black"
                        style={{ transform: [{ rotate: "-180deg" }] }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.resetIndex}>
                      <MaterialCommunityIcons
                        name="undo-variant"
                        size={35}
                        color="black"
                      />
                    </TouchableOpacity>
                  </ButtonView>
                )}
              </NavContainer>
            </SelectionContainer>
          </MiddleContainer>

          <BottomContainer>
            <Button
              onPress={this.continue}
              disabled={
                this.state.selected.length > 0 &&
                this.state.selected.length <= 5
                  ? "false"
                  : "true"
              }
              text={"Continue"}
            />
          </BottomContainer>
        </MainContainer>
      </SafeAreaView>
    );
  }
}

export default PickArtistScreen;
