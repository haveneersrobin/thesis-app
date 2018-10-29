import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import styled from "styled-components";
import { LinearGradient } from "expo";
import * as Animatable from "react-native-animatable";

import ArtistChip from "../components/ArtistChip";

const StyledView = styled(View)`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 25%;
`;

const TitleText = styled(Text)`
  font-family: "droid-bold";
  font-size: 35;
  color: white;
`;

const ArtistsView = styled(Animatable.View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`;

const LoadMoreText = styled(TitleText)`
  font-size: 20;
  margin-top: 20;
`;

class PickArtistScreen extends Component {
  state = {
    index: 0,
    fadeAnim: new Animated.Value(0) // init opacity 0
  };

  nextIndex() {
    this.fadeIn();
    this.setState(prevState => ({
      index: (prevState.index += 6)
    }));
  }

  resetIndex() {
    this.fadeIn();
    this.setState({ index: 0 });
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
          <TitleText>Pick at least 3 artists</TitleText>
          <ArtistsView ref={this.handleViewRef}>
            {artists &&
              artists
                .slice(this.state.index, this.state.index + 6)
                .map(artist => (
                  <ArtistChip
                    key={artist.id}
                    name={artist.name}
                    image={artist.images[artist.images.length - 2]}
                  />
                ))}
          </ArtistsView>
          <TouchableOpacity>
            {this.state.index !== 18 && (
              <LoadMoreText onPress={() => this.nextIndex()}>
                Load more
              </LoadMoreText>
            )}

            {this.state.index === 18 && (
              <LoadMoreText onPress={() => this.resetIndex()}>
                Back to start
              </LoadMoreText>
            )}
          </TouchableOpacity>
        </StyledView>
      </LinearGradient>
    );
  }
}

export default PickArtistScreen;
