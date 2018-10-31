import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo";
import * as Animatable from "react-native-animatable";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ArtistChip from "../components/ArtistChip";
import { ScrollView } from "react-native-gesture-handler";
import { MyText } from "../styles";
import Button from "../components/Button";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ArtistContainer = styled(View)`
  flex: 5;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 60px;
`;

const SelectedContainer = styled(View)`
  flex: 2;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ButtonView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100;
`;

const TitleText = styled(Text)`
  font-family: "droid-bold";
  font-size: 35;
  color: white;
`;

const SubtitleText = styled(TitleText)`
  font-size: 27;
  margin-bottom: 30px;
`;

const ArtistsView = styled(Animatable.View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`;

const NothingSelected = styled(Text)`
  color: rgba(255, 255, 255, 0.4);
  font-size: 14;
`;

const SelectedText = styled(MyText)`
  color: white;
  font-size: 14;
  padding: 10px 6px;
  margin: 4px 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20;
  color: white;
`;

const EndButtonView = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
`;

class PickArtistScreen extends Component {
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
    this._moveIndex(5);
  }

  previousIndex() {
    this._moveIndex(-5);
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
    if (this.state.selected.length >= 3) {
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
          <ArtistContainer>
            <TitleText>Pick at least 3 artists</TitleText>
            <ArtistsView ref={this.handleViewRef}>
              {artists &&
                artists
                  .slice(this.state.index, this.state.index + 5)
                  .map(artist => (
                    <ArtistChip
                      onPress={this.toggleSelection}
                      id={artist.id}
                      key={artist.id}
                      selected={
                        this.state.selected.indexOf(artist.id) !== -1 && "true"
                      }
                      name={artist.name}
                      image={artist.images[artist.images.length - 2]}
                    />
                  ))}
            </ArtistsView>
            <View>
              {this.state.index === 0 && (
                <TouchableOpacity>
                  <Feather
                    onPress={this.nextIndex}
                    name="arrow-right"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              {this.state.index > 0 &&
                this.state.index < (Math.ceil(artists.length / 5) - 1) * 5 && (
                  <ButtonView>
                    <TouchableOpacity>
                      <Feather
                        onPress={this.previousIndex}
                        name="arrow-left"
                        size={30}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Feather
                        onPress={this.nextIndex}
                        name="arrow-right"
                        size={30}
                        color="white"
                      />
                    </TouchableOpacity>
                  </ButtonView>
                )}
              {this.state.index === (Math.ceil(artists.length / 5) - 1) * 5 && (
                <ButtonView>
                  <TouchableOpacity>
                    <Feather
                      onPress={this.previousIndex}
                      name="arrow-left"
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MaterialCommunityIcons
                      onPress={this.resetIndex}
                      name="undo-variant"
                      size={30}
                      color="white"
                    />
                  </TouchableOpacity>
                </ButtonView>
              )}
            </View>
          </ArtistContainer>
          <SelectedContainer>
            <SubtitleText>Currently selected</SubtitleText>
            <View
              flex={0}
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="#8360C3"
              borderRadius={10}
              minWidth="80%"
              maxWidth="80%"
              height="80%"
            >
              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  flexGrow: 0,
                  padding: 10
                }}
              >
                {this.state.selected.length !== 0 &&
                  this.state.selected.map(id => (
                    <SelectedText key={id}>
                      {artists.find(artist => artist.id === id).name}
                    </SelectedText>
                  ))}
                {this.state.selected.length === 0 && (
                  <NothingSelected>No artists selected yet.</NothingSelected>
                )}
              </ScrollView>
            </View>
          </SelectedContainer>
          <EndButtonView>
            <Button
              onPress={this.continue}
              disabled={this.state.selected.length >= 3 ? "false" : "true"}
              text={"Continue"}
            />
          </EndButtonView>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default PickArtistScreen;
