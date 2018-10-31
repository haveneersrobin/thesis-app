import React, { Component } from "react";
import { Text, View } from "react-native";
import axios from "axios";
import Button from "../components/Button";

import { getAccessToken } from "../api";

class SongOverviewScreen extends Component {
  static navigationOptions = {
    title: "Songs",
    error: null
  };

  constructor(props) {
    super(props);

    this.state = {
      artists: this.props.navigation.getParam("artists", undefined),
      results: null
    };

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
      limit: 10,
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

  async playSound(link) {
    try {
      await this.audioPlayer.unloadAsync();
      await this.audioPlayer.loadAsync({ uri: link });
      await this.audioPlayer.playAsync();
    } catch (err) {
      console.warn("Couldn't Play audio", err);
    }
  }

  render() {
    return (
      <View>
        {this.state.results &&
          this.state.results.map(track => (
            <View key={track.id}>
              <Text>
                {track.artist} - {track.name}
              </Text>
              <Button
                onPress={() => this.playSound(track.preview_url)}
                text="Play"
              />
            </View>
          ))}
      </View>
    );
  }
}

export default SongOverviewScreen;
