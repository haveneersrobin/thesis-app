import React, { Component } from "react";
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
  Text
} from "react-native";
import styled from "styled-components";
import posed from "react-native-pose";
import { Header } from "react-navigation";
import { MyText } from "../styles";

import moment from "moment";
import axios from "axios";
import querystring from "querystring";

import Button from "../components/Button";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { getUserID, getAccessToken } from "../api";

import { SkypeIndicator } from "react-native-indicators";

const window = Dimensions.get("window");

const Container = posed.View({
  open: { top: (1 / 6) * window.height, delay: 0 },
  closed: {
    top: window.height - Header.HEIGHT - StatusBar.currentHeight - 50,
    delay: 0
  },
  bounceIn: {
    top: (8 / 10) * window.height,
    transition: { type: "spring" }
  },
  bounceOut: {
    top: window.height - Header.HEIGHT - StatusBar.currentHeight - 50
  }
});

const StyledContainer = styled(Container)`
  position: absolute;
  width: ${window.width};
  height: ${window.height -
    Header.HEIGHT -
    StatusBar.currentHeight -
    (1 / 6) * window.height};
`;

const PanelHeader = styled(View)`
  flex-direction: row;
  height: 50;
  background-color: #5f6fee;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const SlidingContent = styled(View)`
  background-color: #f2f2f2;
  height: ${window.height -
    Header.HEIGHT -
    StatusBar.currentHeight -
    (1 / 6) * window.height -
    40};
`;

const NoTracksView = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-style: italic;
`;

const NoTracksText = styled(MyText)`
  color: grey;
  text-align: center;
  font-size: 20;
`;

const TrackArtist = styled(MyText)`
  font-size: ${responsiveFontSize(2.3)};
  font-family: "roboto-regular";
`;

const TrackTitle = styled(MyText)`
  font-size: ${responsiveFontSize(2.0)};
  font-family: "roboto-regular";
  color: #757575;
`;

const TrackNumber = styled(Text)`
  color: #5f6fee;
  font-size: ${responsiveFontSize(2.3)};
  padding-right: 5px;
  font-family: "roboto-regular";
`;

const TrackView = styled(View)`
  flex-direction: row;
  margin-bottom: 20px;
`;

const ExportButtonView = styled(View)`
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 30px;
`;

class SlidingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingPlaylist: "false"
    };

    this.createAndAdd = this.createAndAdd.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.addSongs = this.addSongs.bind(this);
  }

  async createPlaylist() {
    const userId = await getUserID();
    if (userId) {
      const result = await getAccessToken().then(async accessToken => {
        const body = {
          name: `Mispre Playlist - Created on ${moment().format(
            "D/M/YY (H[h]mm)"
          )}`,
          public: false,
          description:
            "Playlist created with the usage of the Mispre app. This app was developed for a master's thesis. Thank you for taking part."
        };
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken
        };
        return axios
          .post(`https://api.spotify.com/v1/users/${userId}/playlists`, body, {
            headers
          })
          .then(async response => {
            return response.data.id;
          })
          .catch(async err => {
            console.error(err);
            this.setState({ searching: "false" });
          });
      });
      return result;
    }
  }

  async addSongs(id) {
    if (id) {
      const result = await getAccessToken().then(async accessToken => {
        const body = {
          uris: this.props.selected.map(track => track.uri)
        };
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken
        };
        return axios
          .post(`https://api.spotify.com/v1/playlists/${id}/tracks`, body, {
            headers
          })
          .then(async response => response.status)
          .catch(async err => {
            console.error(err);
            this.setState({ searching: "false" });
          });
      });
      return result;
    }
  }

  async createAndAdd() {
    this.setState({ creatingPlaylist: "true" }, async () => {
      const playlistId = await this.createPlaylist();
      const result = await this.addSongs(playlistId);
      if (result == "201") {
        this.setState({ creatingPlaylist: "false" });
        this.props.afterExport();
      }
    });
  }

  render() {
    return (
      <StyledContainer pose={this.props.pose}>
        <TouchableWithoutFeedback onPress={this.props.onPressHeader}>
          <PanelHeader>
            <MyText style={{ color: "#FFF" }}>
              {this.props.selected.length} songs selected
            </MyText>
            <TouchableWithoutFeedback onPress={this.props.onPressHeader}>
              <View>
                <FontAwesome
                  style={{
                    transform: [
                      this.props.visible
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
        </TouchableWithoutFeedback>
        <SlidingContent>
          {!this.props.selected ||
            (this.props.selected.length === 0 && (
              <NoTracksView>
                <NoTracksText> No tracks selected. </NoTracksText>
                <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <NoTracksText> Select tracks using </NoTracksText>
                  <MaterialIcons name="playlist-add" size={23} color="grey" />
                </View>
              </NoTracksView>
            ))}

          {this.props.selected && this.props.selected.length !== 0 && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <ScrollView style={{ padding: 30, height: "85%" }}>
                {this.props.selected.map((track, idx) => (
                  <TrackView key={track.id}>
                    <TrackNumber>{idx + 1}.</TrackNumber>
                    <View style={{ flexDirection: "column" }}>
                      <TrackArtist numberOfLines={1}>
                        {track.artist}
                      </TrackArtist>
                      <TrackTitle numberOfLines={1}>{track.name}</TrackTitle>
                    </View>

                    <View
                      style={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row"
                      }}
                    >
                      <TouchableWithoutFeedback
                        onPress={() => this.props.removeFromList(track.id)}
                      >
                        <Entypo name="cross" size={24} color="#B3BAC8" />
                      </TouchableWithoutFeedback>
                    </View>
                  </TrackView>
                ))}
              </ScrollView>
              <ExportButtonView>
                {this.state.creatingPlaylist === "false" && (
                  <Button
                    color="white"
                    onPress={this.createAndAdd}
                    text={"Export to Spotify"}
                  >
                    <MaterialCommunityIcons
                      name="export"
                      size={24}
                      color="white"
                    />
                  </Button>
                )}

                {this.state.creatingPlaylist === "true" && (
                  <Button color="white">
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 4,
                        paddingBottom: 4
                      }}
                    >
                      <SkypeIndicator color="white" size={30} />
                    </View>
                  </Button>
                )}
              </ExportButtonView>
            </View>
          )}
        </SlidingContent>
      </StyledContainer>
    );
  }
}

export default SlidingPanel;
