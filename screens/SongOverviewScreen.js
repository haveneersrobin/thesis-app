import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Modal,
  Platform,
  Alert
} from "react-native";
import axios from "axios";
import styled from "styled-components";
import { MyText } from "../styles";
import { getAccessToken } from "../api";
import PlayCard from "../components/PlayCard";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import FeaturesSliders from "../components/FeaturesSliders";
import SlidingPanel from "../components/SlidingPanel";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import _ from "lodash";
import { AndroidBackHandler } from "react-navigation-backhandler";
import Analytics from "../Analytics";
import { SkypeIndicator } from "react-native-indicators";

const SongView = styled(View)`
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
`;

const LoadingText = styled(MyText)`
  color: rgba(0, 0, 0, 0.4);
  font-size: ${responsiveFontSize(1.8)};
  font-family: "roboto-regular";
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
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: white;
  border-radius: 15px;
`;

class SongOverviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    let headerRight;
    if (Platform.OS === "android") {
      headerRight = (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(
            "rgba(255,255,255,0.8)",
            true
          )}
          onPress={navigation.getParam("toggleModal")}
        >
          <View style={{ backgroundColor: "#5f6fee" }}>
            <Feather
              name="sliders"
              color="white"
              size={24}
              style={{ paddingRight: 20, paddingLeft: 20 }}
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      <TouchableOpacity onPress={navigation.getParam("toggleModal")}>
        <Feather
          name="sliders"
          color="white"
          size={24}
          style={{ paddingRight: 20 }}
        />
      </TouchableOpacity>;
    }

    return {
      headerRight: navigation.getParam("step") == 1 ? headerRight : undefined,
      error: null
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
      energy: [0, 100],
      afterExportDialogVisible: false
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
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    this.removeSongFromList = this.removeSongFromList.bind(this);
    this.afterExport = this.afterExport.bind(this);
    this.dismissAfterExportDialog = this.dismissAfterExportDialog.bind(this);
    this.continue = this.continue.bind(this);
  }

  continue = () => {
    Analytics.track(Analytics.events.DONE, {
      continue_to: this.props.navigation.getParam("step") == 1 ? 2 : "end"
    });
    this.props.navigation.navigate("PartScreen", {
      part: this.props.navigation.getParam("step") == 1 ? 2 : 3,
      artists: this.props.navigation.getParam("topArtists", undefined)
    });
  };

  onBackButtonPressAndroid = () => {
    this.setState({ playing: null }, async () => {
      try {
        await this.audioPlayer.unloadAsync();
      } catch (err) {
        console.warn("Couldn't Stop audio", err);
      }
    });
    return false;
  };

  componentDidMount() {
    Analytics.track(Analytics.events.ENTER_SONGS_SCREEN, {
      part: this.props.navigation.getParam("step")
    });
    this.props.navigation.setParams({ toggleModal: this.toggleModal });
    this.getRecommendations();
  }

  componentWillUnmount() {
    Analytics.track(Analytics.events.EXIT_SONGS_SCREEN);
  }

  componentWillUnmount() {
    this.setState({ modalVisible: false });
  }

  onCancel() {
    Analytics.track(Analytics.events.CANCEL_SLIDERS);
    this.setState({
      modalVisible: false
    });
  }

  onConfirm(state) {
    Analytics.track(Analytics.events.CONFIRM_SLIDERS, { ...state });
    this.setState({ ...state, modalVisible: false, results: null }, () =>
      this.getRecommendations()
    );
  }

  toggleModal() {
    if (!this.state.modalVisible)
      Analytics.track(Analytics.events.OPEN_SLIDERS);
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible
    }));
  }

  dismissAfterExportDialog() {
    this.setState({ afterExportDialogVisible: false });
  }

  async getMultiplePreviewURL(id, accessToken) {
    return await axios.get(
      `https://api.spotify.com/v1/tracks/?ids=${id.join()}`,
      {
        params: {
          market: "BE"
        },
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
    );
  }

  async getPreviewURLs(ids, accessToken) {
    let todo = ids;
    const ops = [];
    while (todo.length > 45) {
      ops.push(
        await axios.get(
          `https://api.spotify.com/v1/tracks/?ids=${todo.slice(0, 3).join()}`,
          {
            params: {
              market: "BE"
            },
            headers: {
              Authorization: "Bearer " + accessToken
            }
          }
        )
      );
      todo.splice(0, 3);
    }
    let res = await axios.all(ops);
    return _.flatten(res.map(res => res.data.tracks));
  }

  onLike(track) {
    if (
      !this.state.selected.some(selectedTrack => selectedTrack.id === track.id)
    ) {
      Analytics.track(Analytics.events.ADD_TRACK_TO_PLAYLIST, {
        song: `${track.artist} - ${track.name}`
      });
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
      Analytics.track(Analytics.events.REMOVE_TRACK_FROM_PLAYLIST, {
        song: `${track.artist} - ${track.name}`,
        from: "main view"
      });
      this.setState(prevState => {
        const newSelected = prevState.selected.filter(
          current => current.id !== track.id
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
      target_acousticness:
        (this.state.acousticness[0] + this.state.acousticness[1]) / 200 || 0.5,
      target_instrumentalness:
        (this.state.instrumentalness[0] + this.state.instrumentalness[1]) /
          200 || 0.5,
      target_danceability:
        (this.state.danceability[0] + this.state.danceability[1]) / 200 || 0.5,
      target_valence:
        (this.state.valence[0] + this.state.valence[1]) / 200 || 0.5,
      target_energy: (this.state.energy[0] + this.state.energy[1]) / 200 || 0.5
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
            .filter(result => result.preview_url !== null)
            .map(res => ({
              id: res.id,
              artist: res.artists[0].name,
              name: res.name,
              preview_url: res.preview_url,
              uri: res.uri,
              image:
                res.album.images[res.album.images.length - 2] ||
                res.album.images[0]
            }));
          this.setState({
            results: usefulResult
          });
        })
        .catch(async err => {
          console.log(err);
        });
    });
  }

  onPressHeader() {
    this.setState(prevState => ({
      visible: !prevState.visible,
      pose: prevState.visible ? "closed" : "open"
    }));
  }

  removeSongFromList(id) {
    this.setState(prevState => ({
      selected: prevState.selected.filter(el => el.id !== id)
    }));

    const song = this.state.results.find(el => el.id == id);
    Analytics.track(Analytics.events.REMOVE_TRACK_FROM_PLAYLIST, {
      song: `${song.artist} - ${song.name}`,
      from: "sliding panel"
    });
  }

  async playSound(id, link) {
    const song = this.state.results.find(el => el.id == id);

    if (this.state.playing === id) {
      Analytics.track(Analytics.events.PAUSE_TRACK, {
        song: `${song.artist} - ${song.name}`
      });
      this.setState({ playing: null }, async () => {
        try {
          await this.audioPlayer.unloadAsync();
        } catch (err) {
          console.warn("Couldn't Stop audio", err);
        }
      });
    } else {
      Analytics.track(Analytics.events.PLAY_TRACK, {
        song: `${song.artist} - ${song.name}`
      });
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

  afterExport() {
    this.setState({
      pose: "closed",
      visible: false,
      selected: []
    });
    Alert.alert(
      "Export Successful",
      "Exporting to Spotify was successful !",
      [
        {
          text: "Create another playlist",
          style: "cancel"
        },
        {
          text: "Done",
          onPress: () =>
            this.setState({ afterExportDialogVisible: false }, this.continue())
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
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
                <SkypeIndicator color={"#5F6FEE"} size={40} />
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
              onDone={this.continue}
              removeFromList={this.removeSongFromList}
              onPressHeader={this.onPressHeader}
              pose={this.state.pose}
              visible={this.state.visible}
              selected={this.state.selected}
              afterExport={this.afterExport}
            />
          )}
        </SongView>
      </AndroidBackHandler>
    );
  }
}

export default SongOverviewScreen;
