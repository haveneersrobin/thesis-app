import React, { Component } from "react";
import {
  View,
  ScrollView,
  Animated,
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
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import FeaturesSliders from "../components/FeaturesSliders";
import SlidingPanel from "../components/SlidingPanel";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions";
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
  color: white;
  font-size: ${responsiveFontSize(2)};
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

const FloatingView = styled(View)`
  border-radius: 5px;
  background-color: white;
`;

const FloatingContainer = styled(Animated.View)`
  justify-content: center;
  flex-direction: row;
  padding-left: 9px;
  padding-right: 10px;
`;

const ColouredRectangle = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #5f6fee;
  width: 100%;
  overflow: visible;
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
          <View style={{ backgroundColor: "#5f6fee", marginRight: 20 }}>
            <Feather
              name="sliders"
              color="white"
              size={responsiveFontSize(2.8)}
            />
          </View>
        </TouchableNativeFeedback>
      );
    }

    return {
      headerRight,
      error: null,
      title: "Songs",
      headerTitleStyle: {
        paddingLeft: responsiveWidth(2),
        fontFamily: "roboto-bold",
        fontSize: responsiveFontSize(2.2)
      }
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      //artists: this.props.navigation.getParam("artists", undefined),
      artists: [
        "0rHFi0qKLbO72s40s0DZ2h",
        "4TrraAsitQKl821DQY42cZ",
        "5Q81rlcTFh3k6DQJXPdsot",
        "1zNqDE7qDGCsyzJwohVaoX",
        "0nJaMZM8paoA5HEUTUXPqi"
      ],
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
      afterExportDialogVisible: false,
      viewOpacity: new Animated.Value(0),
      animatedHeight: new Animated.Value(0)
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
    let continue_to = this.props.navigation.getParam("step") == 1 ? 2 : 3;
    Analytics.track(Analytics.events.DONE, {
      continue_to
    });
    this.props.navigation.navigate("PartScreen", {
      part: continue_to,
      artists: this.props.navigation.getParam("topArtists", undefined),
      version: this.props.navigation.getParam("version")
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
    this.props.navigation.setParams({
      toggleModal: this.toggleModal
    });
    this.getRecommendations();
  }
  componentWillUnmount() {
    Analytics.track(Analytics.events.EXIT_SONGS_SCREEN);
    this.setState({ modalVisible: false });
  }

  onCancel() {
    Analytics.track(Analytics.events.CANCEL_SLIDERS);
    this.setState({
      modalVisible: false
    });
  }

  onConfirm(state) {
    Analytics.track(Analytics.events.CONFIRM_SLIDERS, {
      ..._.omit(state, "visible")
    });
    this.setState(
      {
        ...state,
        modalVisible: false,
        results: null,
        visible: false,
        pose: "closed"
      },
      () =>
        Animated.timing(this.state.viewOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }).start(() => this.getRecommendations())
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

  async getAudioFeatures(ids, accesToken) {
    const result = await axios.get(
      `https://api.spotify.com/v1/audio-features/?ids=${ids.join()}`,
      {
        params: {
          market: "BE"
        },
        headers: {
          Authorization: "Bearer " + accesToken
        }
      }
    );
    let filteredObject = result.data.audio_features.map(el =>
      _.pick(el, [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "valence"
      ])
    );
    filteredObject.map((el, idx) => {
      Object.keys(el).forEach(
        key => (filteredObject[idx][key] = _.round(el[key] * 100, 3))
      );
    });
    return filteredObject;
  }

  async getPreviewURLs(ids, accessToken) {
    let todo = _.clone(ids);
    const ops = [];
    while (todo.length > 0) {
      ops.push(
        await axios.get(
          `https://api.spotify.com/v1/tracks/?ids=${todo.slice(0, 50).join()}`,
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
      todo.splice(0, 50);
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

  mergeObjects(tracks, features) {
    let result = [];
    tracks.forEach((value, idx) => {
      let temp = _.clone(value);
      temp.features = features[idx];
      result[idx] = temp;
    });
    return result;
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
          const tempResult = await this.getPreviewURLs(trackids, accessToken);
          const audioFeatures = await this.getAudioFeatures(
            trackids,
            accessToken
          );
          const result = this.mergeObjects(tempResult, audioFeatures);
          const usefulResult = result
            .filter(result => result.preview_url !== null)
            .map(res => ({
              id: res.id,
              artist: res.artists[0].name,
              name: res.name,
              preview_url: res.preview_url,
              uri: res.uri,
              features: res.features,
              image:
                res.album.images[res.album.images.length - 2] ||
                res.album.images[0]
            }));
          this.setState(
            {
              results: usefulResult
            },
            () =>
              Animated.timing(this.state.viewOpacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
              }).start(() => {})
          );
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
    const part = this.props.navigation.getParam("step");
    const version = this.props.navigation.getParam("version");
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
          <ColouredRectangle
            style={{
              height: responsiveHeight(25)
            }}
          />
          {!this.state.results && (
            <View style={{ marginTop: responsiveHeight(8) }}>
              <SkypeIndicator color={"white"} size={responsiveFontSize(6)} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: responsiveHeight(6)
                }}
              >
                <FontAwesome
                  name="magic"
                  color="white"
                  style={{ marginRight: responsiveWidth(3) }}
                  size={responsiveFontSize(2.6)}
                />
                <LoadingText>Crunching recommendations ...</LoadingText>
              </View>
            </View>
          )}
          <FloatingContainer
            style={{
              opacity: this.state.viewOpacity
            }}
          >
            <FloatingView>
              <ScrollView>
                {this.state.results &&
                  this.state.results.map((track, idx) => (
                    <PlayCard
                      index={idx}
                      key={track.id}
                      id={track.id}
                      artist={track.artist}
                      showInfo={
                        true ||
                        (version == "A" && part == 1) ||
                        (version == "B" && part == 2)
                      }
                      sliders={{
                        acousticness: this.state.acousticness,
                        instrumentalness: this.state.instrumentalness,
                        danceability: this.state.danceability,
                        valence: this.state.valence,
                        energy: this.state.energy
                      }}
                      name={track.name}
                      features={track.features}
                      onPress={() =>
                        this.playSound(track.id, track.preview_url)
                      }
                      onLike={() => this.onLike(track)}
                      image={track.image}
                      playing={this.state.playing === track.id}
                      selected={this.state.selected.some(
                        selected => selected.id === track.id
                      )}
                    />
                  ))}
              </ScrollView>
            </FloatingView>
          </FloatingContainer>
        </SongView>
        {this.state.results && (
          <SlidingPanel
            animOpacity={this.state.viewOpacity}
            onDone={this.continue}
            removeFromList={this.removeSongFromList}
            onPressHeader={this.onPressHeader}
            pose={this.state.pose}
            visible={this.state.visible}
            selected={this.state.selected}
            afterExport={this.afterExport}
          />
        )}
      </AndroidBackHandler>
    );
  }
}

export default SongOverviewScreen;
