import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  StatusBar,
  Platform,
  TouchableNativeFeedback
} from "react-native";
import styled from "styled-components";
import { Feather } from "@expo/vector-icons";
import ArtistChip from "../components/ArtistChip";
import { ScrollView } from "react-native-gesture-handler";
import { MyText } from "../styles";
import Button from "../components/Button";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-navigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import _ from "lodash";
import { LinearGradient } from "expo";
import { getAccessToken } from "../api";
import axios from "axios";

const MainContainer = styled(View)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #f2f2f2;
  justify-content: center;
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
  flex: 2;
  justify-content: flex-start;
  align-items: center;
`;

const SelectedContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`;

const SelectionContainer = styled(View)`
  flex: 5;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ArtistsContainer = styled(ScrollView)``;

const NothingSelected = styled(Text)`
  color: rgba(0, 0, 0, 0.4);
  font-size: ${responsiveFontSize(1.4)};
  font-family: "roboto-regular";
`;

const SelectedText = styled(MyText)`
  color: #8b919d;
  font-size: 14;
  padding: 12px 10px;
  margin-left: 4px;
  margin-right: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20;
`;

const BottomContainer = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 50px;
`;

class PickArtistScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      fadeAnim: new Animated.Value(0), // init opacity 0
      selected: [],
      artists: []
    };
    this.toggleSelection = this.toggleSelection.bind(this);
    this.continue = this.continue.bind(this);
    this.addArtist = this.addArtist.bind(this);

    this.fetchTopArtist = this.fetchTopArtist.bind(this);
  }

  componentWillMount() {
    this.fetchTopArtist();
  }

  async fetchTopArtist() {
    const accessToken = getAccessToken();
    const result = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
    );

    const filtered = result.data.items.map(item =>
      Object.keys(item)
        .filter(key => ["external_urls", "name", "images", "id"].includes(key))
        .reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {})
    );
    this.setState({ artists: filtered });
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
    if (this.state.selected.length > 0 && this.state.selected.length <= 5) {
      this.props.navigation.navigate("SongOverviewScreen", {
        artists: this.state.selected,
        topArtists: this.state.artists,
        step: this.props.navigation.getParam("step", undefined)
      });
    }
  }

  handleViewRef = ref => (this.view = ref);
  fadeIn = () => this.view.fadeIn(800);

  splitArtists(artists) {
    if (!artists) return artists;
    else {
      const columns = [];
      while (artists.length > 0) {
        const chunk = artists.splice(0, 4);
        columns.push(chunk);
      }
      return columns;
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
              Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight + 40
          }}
        >
          <TitleContainer>
            <TitleText>
              Pick up to 5 artists
              <Text style={{ fontSize: 45, color: "#5F6FEE" }}>.</Text>
            </TitleText>
            <Border />
          </TitleContainer>

          <MiddleContainer>
            <SelectedContainer>
              {this.state.selected.length !== 0 && (
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexGrow: 0
                  }}
                  showsHorizontalScrollIndicator={false}
                >
                  <MaterialIcons name="navigate-next" color="#8b919d" />
                  {this.state.selected.map(id => (
                    <SelectedText key={id}>
                      {this.state.artists.find(artist => artist.id === id).name}
                    </SelectedText>
                  ))}
                  <MaterialIcons
                    name="navigate-next"
                    color="#8b919d"
                    style={{ transform: [{ rotate: "-180deg" }] }}
                  />
                </ScrollView>
              )}
              {this.state.selected.length === 0 && (
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
            <SelectionContainer>
              <ArtistsContainer
                horizontal={true}
                contentContainerStyle={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  flexGrow: 0,
                  paddingLeft: 15,
                  paddingRight: 15
                }}
                showsHorizontalScrollIndicator={false}
                ref={this.handleViewRef}
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
              </ArtistsContainer>
            </SelectionContainer>
            <LinearGradient
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
            />
          </MiddleContainer>

          <BottomContainer>
            <View
              style={{
                borderRadius: 50,
                overflow: "hidden",
                marginBottom: 70,
                backgroundColor: "#E4E4E4"
              }}
            >
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
            </View>
            <Button
              onPress={this.continue}
              disabled={
                this.state.selected.length > 0 &&
                this.state.selected.length <= 5
                  ? "false"
                  : "true"
              }
              text={"Continue"}
            />
          </BottomContainer>
        </MainContainer>
      </SafeAreaView>
    );
  }
}

export default PickArtistScreen;
