import React, { Component } from "react";
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
  Text,
  Animated
} from "react-native";
import styled from "styled-components";
import posed from "react-native-pose";
import { Header } from "react-navigation";
import { MyText } from "../styles";

import moment from "moment";
import axios from "axios";

import Button from "../components/Button";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions";
import { getUserID, getAccessToken } from "../api";

import Analytics from "../Analytics";
import { SkypeIndicator } from "react-native-indicators";

const window = Dimensions.get("window");

const Container = posed.View({
  open: {
    top:
      window.height -
      responsiveHeight(70) -
      Header.HEIGHT -
      StatusBar.currentHeight -
      responsiveHeight(5.9),
    delay: 0
  },
  closed: {
    top:
      window.height -
      Header.HEIGHT -
      StatusBar.currentHeight -
      responsiveHeight(6),
    delay: 0
  },
  bounceIn: {
    top:
      window.height -
      Header.HEIGHT -
      StatusBar.currentHeight -
      responsiveHeight(12),
    transition: { type: "spring" }
  },
  bounceOut: {
    top:
      window.height -
      Header.HEIGHT -
      StatusBar.currentHeight -
      responsiveHeight(6)
  }
});

const StyledContainer = styled(Container)`
  position: absolute;
  width: ${window.width};
  height: ${responsiveHeight(80)};
`;

const PanelHeader = styled(Animated.View)`
  flex-direction: row;
  height: ${responsiveHeight(6)};
  background-color: #5f6fee;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-left: ${responsiveWidth(6)};
  padding-right: ${responsiveWidth(6)};
`;
/*height: ${window.height -
Header.HEIGHT -
StatusBar.currentHeight -
(1 / 6) * window.height -
50};*/
const SlidingContent = styled(View)`
  background-color: #f2f2f2;
  height: ${responsiveHeight(70)};
`;

const NoTracksView = styled(View)`
  justify-content: center;
  align-items: center;
  margin-top: ${responsiveHeight(3.4)};
  font-style: italic;
  padding-left: ${responsiveWidth(2)};
  padding-right: ${responsiveWidth(2)};
`;

const NoTracksText = styled(MyText)`
  color: grey;
  text-align: center;
  font-size: ${responsiveFontSize(2)};
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
  padding-right: ${responsiveWidth(1)};
  font-family: "roboto-regular";
`;

const TrackView = styled(View)`
  flex-direction: row;
  margin-bottom: ${responsiveHeight(3)};
`;

const ExportButtonView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: ${responsiveHeight(4)};
  margin-right: ${responsiveWidth(4)};
  margin-left: ${responsiveWidth(4)};
  padding-bottom: ${responsiveHeight(2)};
`;

const ExportText = styled(Text)`
  font-family: "roboto-light";
`;

const StyledScrollView = styled(ScrollView)`
  padding-left: ${responsiveWidth(4)};
  padding-right: ${responsiveWidth(4)};
  height: 80%;
  ${props =>
    props.addPadding === "true" && `padding-top: ${responsiveHeight(4)}`};
`;

class SlidingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingPlaylist: "false"
    };

    this.createAndAdd = this.createAndAdd.bind(this);
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
    Analytics.track(Analytics.events.EXPORT_PLAYLIST, {
      playlist_length: this.props.selected.length
    });

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
          <PanelHeader style={{ opacity: this.props.animOpacity }}>
            <MyText
              style={{ color: "#FFF", fontSize: responsiveFontSize(1.7) }}
            >
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
                  size={responsiveFontSize(2.5)}
                />
              </View>
            </TouchableWithoutFeedback>
          </PanelHeader>
        </TouchableWithoutFeedback>

        <SlidingContent>
          {!this.props.selected ||
            (this.props.selected.length === 0 && (
              <NoTracksView>
                <NoTracksText>
                  Please select at least 1 track before exporting.
                </NoTracksText>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: responsiveHeight(3)
                  }}
                >
                  <NoTracksText> Select tracks using </NoTracksText>
                  <MaterialIcons
                    name="playlist-add"
                    size={responsiveFontSize(3)}
                    color="grey"
                  />
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
              <StyledScrollView
                addPadding={this.props.selected.length >= 1 ? "true" : "false"}
              >
                {this.props.selected.map((track, idx) => (
                  <TrackView key={track.id}>
                    <TrackNumber>{idx + 1}.</TrackNumber>
                    <View
                      style={{
                        flexDirection: "column",
                        width: responsiveWidth(70)
                      }}
                    >
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
              </StyledScrollView>
              <ExportButtonView>
                {this.state.creatingPlaylist === "false" && (
                  <Button
                    color={"#049138"}
                    bgColor={"#C2F8CB"}
                    onPress={this.createAndAdd}
                    disabled={this.props.selected.length < 1 && "true"}
                    text={"Export to Spotify"}
                  >
                    <MaterialCommunityIcons
                      name="export"
                      size={responsiveFontSize(2.4)}
                      color="#049138"
                    />
                  </Button>
                )}

                {this.state.creatingPlaylist === "true" && (
                  <Button color={"#049138"} bgColor={"#C2F8CB"}>
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 4,
                        paddingBottom: 4
                      }}
                    >
                      <SkypeIndicator
                        color={"#049138"}
                        size={responsiveFontSize(2.4)}
                      />
                    </View>
                  </Button>
                )}
                <Button
                  onPress={this.props.onDone}
                  disabled={
                    this.props.selected.length < 1 &&
                    this.state.creatingPlaylist === "false" &&
                    "true"
                  }
                  color="white"
                  text="Done"
                >
                  <View>
                    <MaterialIcons
                      name="done"
                      size={responsiveFontSize(2.4)}
                      color="white"
                    />
                  </View>
                </Button>
              </ExportButtonView>
            </View>
          )}
        </SlidingContent>
      </StyledContainer>
    );
  }
}

export default SlidingPanel;
