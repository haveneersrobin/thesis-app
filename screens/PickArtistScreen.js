import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableNativeFeedback,
  ScrollView
} from "react-native";
import styled from "styled-components";
import ArtistChip from "../components/ArtistChip";
import { MyText } from "../styles";
import Button from "../components/Button";
import {
  responsiveFontSize,
  responsiveHeight
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-navigation";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import _ from "lodash";
import { LinearGradient } from "expo";
import { getAccessToken } from "../api";
import axios from "axios";
import { SkypeIndicator } from "react-native-indicators";
import Analytics from "../Analytics";
import { alertError } from "../utils";
import * as env from "../env";

const MainContainer = styled(View)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #f2f2f2;
  justify-content: flex-start;
  align-items: center;
`;

const TitleContainer = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: flex-start;
  margin-left: 25px;
`;

const TitleText = styled(Text)`
  font-family: "roboto-light";
  font-size: ${responsiveFontSize(4)};
  color: black;
`;

const Border = styled(View)`
  border-bottom-color: #5f6fee;
  border-bottom-width: 5px;
  align-self: stretch;
  margin-right: 50px;
  margin-top: 7px;
  border-radius: 5px;
`;

const MiddleContainer = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const BottomContainer = styled(View)`
  flex: 3 1 auto;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: ${responsiveHeight(2)};
`;

const SelectedContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
  height: ${responsiveHeight(7)};
`;

const SelectionContainer = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: ${responsiveHeight(50)};
`;

const NothingSelected = styled(Text)`
  color: rgba(0, 0, 0, 0.4);
  font-size: ${responsiveFontSize(1.4)};
  font-family: "roboto-regular";
`;

const SelectedText = styled(MyText)`
  color: #8b919d;
  font-size: ${responsiveFontSize(1.4)};
  padding: 12px 10px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20;
`;

const SearchTextContainer = styled(View)`
  border-radius: 50;
  overflow: hidden;
  background-color: #e4e4e4;
`;

class PickArtistScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      selected: [],
      artists: []
    };

    this.fetchTopArtist = this.fetchTopArtist.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.addArtist = this.addArtist.bind(this);
    this.continue = this.continue.bind(this);
  }

  async componentDidMount() {
    try {
      await this.fetchTopArtist();
    } catch (error) {}
    Analytics.track(Analytics.events.ENTER_ARTIST_SELECTION_SCREEN);
  }

  async fetchTopArtist() {
    let result;
    try {
      result = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: env.GET_HEADERS(await getAccessToken())
      });
    } catch (error) {
      alertError(error);
    }

    let artistsToUse;
    if (result.data.items.length != 0) {
      artistsToUse = result.data.items;
    } else {
      try {
        artistsToUse = await this.getBelgiumTop50Artists();
      } catch (error) {
        alertError("Could not fetch top Belgium artists");
      }
    }
    this.setState({
      artists: artistsToUse.map(item =>
        _.pick(item, ["external_urls", "name", "images", "id"])
      )
    });
  }

  async getBelgiumTop50Artists() {
    let result;
    const playlist_id = "37i9dQZEVXbJNSeeHswcKB";
    try {
      result = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist_id}`,
        {
          headers: env.GET_HEADERS(await getAccessToken())
        }
      );
    } catch (error) {
      alertError(JSON.stringify(error) + " Could not fetch top artists");
    }
    const temp = _.uniq(
      result.data.tracks.items
        .map(item => item.track.album.artists[0].id)
        .slice(0, 20)
    );

    let artists_objects;
    try {
      artists_objects = await axios.get("https://api.spotify.com/v1/artists", {
        params: {
          ids: temp.join()
        },
        headers: env.GET_HEADERS(await getAccessToken())
      });
    } catch (error) {
      alertError(
        JSON.stringify(error) + " Could not fetch top artists objects"
      );
    }
    return artists_objects.data.artists;
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
    const selectedArtistNames = this.state.artists
      .filter(artist => this.state.selected.includes(artist.id))
      .map(artist => artist.name);
    if (this.state.selected.length > 0 && this.state.selected.length <= 5) {
      Analytics.track(Analytics.events.EXIT_ARTIST_SELECTION_SCREEN, {
        selected_artists: selectedArtistNames
      });
      this.props.navigation.navigate("SongOverviewScreen", {
        artists: this.state.selected,
        topArtists: this.state.artists,
        step: this.props.navigation.getParam("step", undefined)
      });
    }
  }

  addArtist(artist) {
    const artistsInState = this.state.artists;
    if (!artistsInState.find(el => el.id === artist.id)) {
      artistsInState.unshift(artist);
      this.setState({ artists: artistsInState });
    }
    const selectedInState = this.state.selected;
    selectedInState.unshift(artist.id);
    this.setState({ selected: selectedInState });
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "#f2f2f2", color: "black" }}>
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        />
        <MainContainer
          style={{
            paddingTop:
              Platform.OS === "ios"
                ? 0
                : Expo.Constants.statusBarHeight + responsiveHeight(3)
          }}
        >
          <TitleContainer>
            <TitleText>
              Pick up to 5 artists
              <Text
                style={{ fontSize: responsiveFontSize(1.5), color: "#5F6FEE" }}
              >
                .
              </Text>
            </TitleText>
            <Border />
          </TitleContainer>

          <MiddleContainer>
            {this.state.artists.length == 0 && (
              <SkypeIndicator color={"black"} size={30} />
            )}
            <SelectedContainer>
              {this.state.artists &&
                this.state.artists.length != 0 &&
                this.state.selected.length !== 0 && (
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}
                    showsHorizontalScrollIndicator={false}
                  >
                    <MaterialIcons name="navigate-next" color="#8b919d" />
                    {this.state.selected.map(id => (
                      <SelectedText key={id}>
                        {
                          this.state.artists.find(artist => artist.id === id)
                            .name
                        }
                      </SelectedText>
                    ))}
                    <MaterialIcons
                      name="navigate-next"
                      color="#8b919d"
                      style={{ transform: [{ rotate: "-180deg" }] }}
                    />
                  </ScrollView>
                )}
              {this.state.artists &&
                this.state.artists.length != 0 &&
                this.state.selected.length === 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Feather
                      name="info"
                      color="rgba(0, 0, 0, 0.4)"
                      style={{ marginRight: 8 }}
                    />
                    <NothingSelected>
                      Your selected artists will appear here.
                    </NothingSelected>
                  </View>
                )}
            </SelectedContainer>
            {this.state.artists && this.state.artists.length != 0 && (
              <SelectionContainer>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    paddingLeft: 15,
                    paddingRight: 15
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.artists &&
                    _.chunk(this.state.artists, 4).map(col => (
                      <View
                        key={col[0].id + "col"}
                        style={{
                          flexDirection: "column"
                        }}
                      >
                        {col.map(artist => (
                          <ArtistChip
                            onPress={this.toggleSelection}
                            id={artist.id}
                            key={artist.id}
                            selected={
                              this.state.selected.indexOf(artist.id) !== -1 &&
                              "true"
                            }
                            name={artist.name}
                            image={artist.images[artist.images.length - 2]}
                          />
                        ))}
                      </View>
                    ))}
                </ScrollView>
                {/*<LinearGradient
                  colors={["transparent", "rgba(255,255,255,0.6)"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  locations={[0.8, 0.95]}
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 103,
                    height: 374
                  }}
                />*/}
              </SelectionContainer>
            )}
            <SearchTextContainer>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "rgba(255,255,255,0.3)",
                  false
                )}
                useForeground={true}
                onPress={() =>
                  this.props.navigation.navigate("Search", {
                    addArtist: this.addArtist
                  })
                }
              >
                <View
                  style={{
                    width: 150,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                >
                  <MaterialIcons
                    size={12}
                    name="search"
                    color="#616161"
                    style={{ paddingRight: 10 }}
                  />
                  <Text
                    style={{
                      color: "#616161",
                      fontSize: 14,
                      fontFamily: "roboto-medium"
                    }}
                  >
                    Search artist
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </SearchTextContainer>
          </MiddleContainer>

          <BottomContainer>
            <Button
              onPress={this.continue}
              disabled={
                this.state.selected.length > 0 &&
                this.state.selected.length <= 5
                  ? "false"
                  : "true"
              }
              text={"Continue"}
            >
              <Feather name="arrow-right-circle" size={24} color="white" />
            </Button>
          </BottomContainer>
        </MainContainer>
      </SafeAreaView>
    );
  }
}

export default PickArtistScreen;
