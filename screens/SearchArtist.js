import React, { Component } from "react";
import {
  View,
  StatusBar,
  Platform,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  ScrollView
} from "react-native";
import styled from "styled-components";
import { SafeAreaView } from "react-navigation";
import { getAccessToken } from "../api";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import _ from "lodash";
import axios from "axios";

import { SkypeIndicator } from "react-native-indicators";

const window = Dimensions.get("window");

const MainContainer = styled(View)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #f2f2f2;
  justify-content: flex-start;
  align-items: center;
`;

class SearchArtist extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: [],
      searching: "false"
    };

    this.searchArtist = this.searchArtist.bind(this);
  }

  searchArtist() {
    this.setState({ searching: "true" });
    if (this.state.query.length > 0) {
      const body = {
        q: this.state.query,
        type: "artist"
      };
      getAccessToken().then(accessToken => {
        axios
          .get("https://api.spotify.com/v1/search", {
            params: body,
            headers: {
              Authorization: "Bearer " + accessToken
            }
          })
          .then(async response => {
            console.log(response);
            this.setState({
              results: response.data.artists.items,
              searching: "false"
            });
          })
          .catch(async err => {
            console.log(err);
            this.setState({ searching: "false" });
          });
      });
    }
  }

  render() {
    const { navigation } = this.props;

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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20
            }}
          >
            <TextInput
              style={{
                borderRadius: 50,
                backgroundColor: "#E4E4E4",
                width: window.width * 0.7,
                height: 40,
                paddingLeft: 20,
                paddingRight: 20
              }}
              onChangeText={text => this.setState({ query: text })}
              selectionColor={"#616161"}
              placeholder={"Search artists"}
              placeholderTextColor={"#616161"}
            />
            <TouchableWithoutFeedback onPress={this.searchArtist}>
              <MaterialIcons
                size={24}
                name="search"
                color={this.state.query.length > 0 ? "#616161" : "#E0E0E0"}
                style={{ paddingLeft: 15 }}
              />
            </TouchableWithoutFeedback>
          </View>

          {this.state.searching === "true" && (
            <View
              style={{
                marginTop: 30,
                flexDirection: "row"
              }}
            >
              <SkypeIndicator color="#616161" />
            </View>
          )}

          {this.state.searching === "false" && this.state.results.length !== 0 && (
            <ScrollView>
              {this.state.results.map(artist => (
                <Text>{artist.name}</Text>
              ))}
            </ScrollView>
          )}

          {this.state.searching === "false" &&
            this.state.results.length === 0 && (
              <Text style={{ color: "#616161", marginTop: 20 }}>
                Start searching for artists using the field above.
              </Text>
            )}
        </MainContainer>
      </SafeAreaView>
    );
  }
}

export default SearchArtist;
