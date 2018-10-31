import React, { Component } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import styled from "styled-components";
import { MyText } from "../styles";

const SongView = styled(View)`
  padding: 20px 10px;
  flex: 1;
  flex-direction: column;
  background-color: white;
`;

const LoadingText = styled(MyText)`
  font-size: 14;
  margin-top: 5px;
  color: #9a9a9a;
  text-align: center;
`;

import { getAccessToken } from "../api";
import PlayCard from "../components/PlayCard";

class SongOverviewScreen extends Component {
  static navigationOptions = {
    title: "Songs",
    error: null
  };

  constructor(props) {
    super(props);

    this.state = {
      /* artists: [
        "0rHFi0qKLbO72s40s0DZ2h",
        "4TrraAsitQKl821DQY42cZ",
        "5Q81rlcTFh3k6DQJXPdsot",
        "1zNqDE7qDGCsyzJwohVaoX",
        "0nJaMZM8paoA5HEUTUXPqi"
      ], */
      artists: this.props.navigation.getParam("artists", undefined),
      results: null
    };

    console.log(this.props.navigation.getParam("artists", undefined));

    this.audioPlayer = new Expo.Audio.Sound();
    this.getRecommendations = this.getRecommendations.bind(this);
    this.playSound = this.playSound.bind(this);
    this.getRecommendations();
  }

  async getPreviewURL(id, accessToken) {
    return await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      params: {
        market: "BE"
      },
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });
  }

  async getPreviewURLs(ids, accesToken) {
    const ops = [];
    ids.forEach(id => {
      let op = this.getPreviewURL(id, accesToken);
      ops.push(op);
    });
    let res = await axios.all(ops);
    return res;
  }

  getRecommendations() {
    const body = {
      limit: 50,
      seed_artists: this.state.artists.join()
    };

    getAccessToken().then(accessToken => {
      axios
        .get("https://api.spotify.com/v1/recommendations", {
          params: body,
          headers: {
            Authorization: "Bearer " + accessToken
          }
        })
        .then(async response => {
          const trackids = response.data.tracks.map(track => track.id);
          const result = await this.getPreviewURLs(trackids, accessToken);
          const usefulResult = result
            .filter(result => result.data.preview_url !== null)
            .map(res => ({
              id: res.data.id,
              artist: res.data.artists[0].name,
              name: res.data.name,
              preview_url: res.data.preview_url,
              image:
                res.data.album.images[res.data.album.images.length - 2] ||
                res.data.album.images[0]
            }));
          this.setState({ results: usefulResult });
        });
    });
  }

  async playSound(id, link) {
    if (this.state.playing === id) {
      this.setState({ playing: null }, async () => {
        try {
          await this.audioPlayer.unloadAsync();
        } catch (err) {
          console.warn("Couldn't Play audio", err);
        }
      });
    } else {
      this.setState({ playing: id }, async () => {
        try {
          await this.audioPlayer.unloadAsync();
          await this.audioPlayer.loadAsync({ uri: link });
          await this.audioPlayer.playAsync();
        } catch (err) {
          console.warn("Couldn't Play audio", err);
        }
      });
    }
  }

  render() {
    return (
      <SongView>
        <ScrollView>
          {!this.state.results && (
            <View>
              <ActivityIndicator size="large" color="#8360C3" />
              <LoadingText>Crunching recommendations ...</LoadingText>
            </View>
          )}
          {this.state.results &&
            this.state.results.map(track => (
              <PlayCard
                key={track.id}
                id={track.id}
                artist={track.artist}
                name={track.name}
                onPress={() => this.playSound(track.id, track.preview_url)}
                image={track.image}
                playing={this.state.playing === track.id}
              />
            ))}
        </ScrollView>
      </SongView>
    );
  }
}

export default SongOverviewScreen;
