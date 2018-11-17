import React, { Component } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Modal
} from "react-native";
import axios from "axios";
import styled from "styled-components";
import { MyText } from "../styles";
import { getAccessToken } from "../api";
import PlayCard from "../components/PlayCard";
import { Feather, FontAwesome } from "@expo/vector-icons";
import Button from "../components/Button";
import FeaturesSliders from "../components/FeaturesSliders";
import SlidingPanel from "../components/SlidingPanel";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const SongView = styled(View)`
  flex: 1;
  flex-direction: column;
  background-color: #f2f2f2;
`;

const LoadingText = styled(MyText)`
  color: rgba(0, 0, 0, 0.4);
  font-size: ${responsiveFontSize(1.8)};
  font-family: "sans-lightitalic";
  text-align: center;
`;

const ModalContainer = styled(View)`
  background-color: rgba(1, 1, 1, 0.4);
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(View)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
`;

class SongOverviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableWithoutFeedback onPress={() => console.log("menu")}>
          <Feather
            name="menu"
            color="white"
            size={24}
            style={{ paddingLeft: 20 }}
          />
        </TouchableWithoutFeedback>
      ),
      error: null,
      headerRight: (
        <TouchableWithoutFeedback onPress={navigation.getParam("toggleModal")}>
          <Feather
            name="sliders"
            color="white"
            size={24}
            style={{ paddingRight: 20 }}
          />
        </TouchableWithoutFeedback>
      )
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      artists: this.props.navigation.getParam("artists", undefined),
      visible: false,
      pose: "closed",
      modalVisible: false,
      bounceIn: false,
      bounceOut: false,
      selected: [],
      acousticness: [0, 100],
      instrumentalness: [0, 100],
      danceability: [0, 100],
      valence: [0, 100],
      energy: [0, 100]
    };

    this.audioPlayer = new Expo.Audio.Sound();
    this.getRecommendations = this.getRecommendations.bind(this);
    this.playSound = this.playSound.bind(this);
    this.onLike = this.onLike.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.bounce = this.bounce.bind(this);
    this.onPressHeader = this.onPressHeader.bind(this);
    this.getRecommendations();
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleModal: this.toggleModal });
  }

  componentWillUnmount() {
    this.setState({ modalVisible: false });
  }

  onCancel() {
    this.setState({
      modalVisible: false
    });
  }

  onConfirm(state) {
    this.setState({ ...state, modalVisible: false, results: null }, () =>
      this.getRecommendations()
    );
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

  toggleModal() {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible
    }));
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

  onLike(track) {
    if (
      !this.state.selected.some(selectedTrack => selectedTrack.id === track.id)
    ) {
      const first = this.state.selected.length === 0;
      this.setState(
        prevState => {
          const newSelected = prevState.selected;
          newSelected.push(track);
          return { selected: newSelected };
        },
        first ? this.bounce() : () => {}
      );
    } else {
      this.setState(prevState => {
        const newSelected = prevState.selected.filter(
          current => track.id !== current.id
        );
        return { selected: newSelected };
      });
    }
  }

  bounce() {
    this.setState({ pose: "bounceIn" }, () => {
      setTimeout(() => {
        this.setState({
          pose: "bounceOut"
        });
      }, 400);
    });
  }

  getRecommendations() {
    const body = {
      limit: 100,
      seed_artists: this.state.artists.join(),
      min_acousticness: this.state.acousticness[0] / 100 || 0,
      max_acousticness: this.state.acousticness[1] / 100 || 1,
      min_instrumentalness: this.state.instrumentalness[0] / 100 || 0,
      max_instrumentalness: this.state.instrumentalness[1] / 100 || 1,
      min_danceability: this.state.danceability[0] / 100 || 0,
      max_danceability: this.state.danceability[1] / 100 || 1,
      min_valence: this.state.valence[0] / 100 || 0,
      max_valence: this.state.valence[1] / 100 || 1,
      min_energy: this.state.energy[0] / 100 || 0,
      max_energy: this.state.energy[1] / 100 || 1
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
          this.setState({
            results: usefulResult
          });
        });
    });
  }

  onPressHeader() {
    this.setState(prevState => ({
      visible: !prevState.visible,
      pose: prevState.visible ? "closed" : "open"
    }));
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
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState(prevState => ({
              modalVisible: !prevState.modalVisible
            }));
          }}
          transparent={true}
          animationType="fade"
        >
          <ModalContainer>
            <ModalContent elevation={3}>
              <FeaturesSliders
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
                acousticness={this.state.acousticness}
                instrumentalness={this.state.instrumentalness}
                danceability={this.state.danceability}
                valence={this.state.valence}
                energy={this.state.energy}
              />
            </ModalContent>
          </ModalContainer>
        </Modal>

        <ScrollView style={{ marginBottom: 50 }}>
          {!this.state.results && (
            <View style={{ marginTop: 30 }}>
              <ActivityIndicator size="large" color="#5f6fee" />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10
                }}
              >
                <FontAwesome
                  name="magic"
                  color="rgba(0, 0, 0, 0.4)"
                  style={{ marginRight: 10 }}
                  size={20}
                />
                <LoadingText>Crunching recommendations ...</LoadingText>
              </View>
            </View>
          )}
          {this.state.results &&
            this.state.results.map((track, idx) => (
              <PlayCard
                index={idx}
                key={track.id}
                id={track.id}
                artist={track.artist}
                name={track.name}
                onPress={() => this.playSound(track.id, track.preview_url)}
                onLike={() => this.onLike(track)}
                image={track.image}
                playing={this.state.playing === track.id}
                selected={this.state.selected.some(
                  selected => selected.id === track.id
                )}
              />
            ))}
        </ScrollView>
        {this.state.results && (
          <SlidingPanel
            onPressHeader={this.onPressHeader}
            pose={this.state.pose}
            visible={this.state.visible}
            selected={this.state.selected}
          />
        )}
      </SongView>
    );
  }
}

export default SongOverviewScreen;
