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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Button from "../components/Button";
import FeaturesSliders from "../components/FeaturesSliders";

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

const PanelView = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  height: 200;
  background-color: #8360c3;
  border-radius: 20px;
`;

const PanelHeader = styled(View)`
  flex-direction: row;
  height: 50;
  background-color: #8360c3;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Container = styled(View)`
  flex: 1;
  background-color: blue;
  align-items: center;
  justify-content: center;
`;

const SlidingUpPanel = styled(View)`
  flex: 1;
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

const ModalButtons = styled(View)`
  flex-direction: row;
`;

class SongOverviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Songs",
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
      artists: [
        "0rHFi0qKLbO72s40s0DZ2h",
        "4TrraAsitQKl821DQY42cZ",
        "5Q81rlcTFh3k6DQJXPdsot",
        "1zNqDE7qDGCsyzJwohVaoX",
        "0nJaMZM8paoA5HEUTUXPqi"
      ],
      //artists: this.props.navigation.getParam("artists", undefined),
      results: null,
      visible: false,
      modalVisible: false,
      selected: []
    };

    this.audioPlayer = new Expo.Audio.Sound();
    this.getRecommendations = this.getRecommendations.bind(this);
    this.playSound = this.playSound.bind(this);
    this.onLike = this.onLike.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getRecommendations();
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleModal: this.toggleModal });
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
    console.log("ello");
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

  onLike(id) {
    this.setState(prevState => {
      const newSelected = prevState.selected;
      newSelected.push(id);
      return { selected: newSelected, visible: true };
    });
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
              <Text>Hello World!</Text>
              <FeaturesSliders />
              <ModalButtons>
                <Button
                  bgColor={"white"}
                  color={"#8360C3"}
                  text={"Cancel"}
                  onPress={() => {
                    this.setState(prevState => ({
                      modalVisible: !prevState.modalVisible
                    }));
                  }}
                />
                <Button text={"Confirm"} />
              </ModalButtons>
            </ModalContent>
          </ModalContainer>
        </Modal>

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
                onLike={() => this.onLike(track.id)}
                image={track.image}
                playing={this.state.playing === track.id}
              />
            ))}
        </ScrollView>
        {this.state.results && (
          <SlidingUpPanel>
            <PanelView visible={this.state.visible}>
              <PanelHeader>
                <MyText style={{ color: "#FFF" }}>
                  {this.state.selected.length} songs selected
                </MyText>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState(prevState => ({
                      visible: !prevState.visible
                    }))
                  }
                >
                  <View>
                    <FontAwesome
                      style={{
                        transform: [
                          this.state.visible
                            ? { rotate: "180deg" }
                            : { rotate: "0deg" }
                        ]
                      }}
                      color="white"
                      name="arrow-circle-up"
                      size={24}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </PanelHeader>
              <Container>
                <Text>Bottom Sheet Content</Text>
              </Container>
            </PanelView>
          </SlidingUpPanel>
        )}
      </SongView>
    );
  }
}

export default SongOverviewScreen;
