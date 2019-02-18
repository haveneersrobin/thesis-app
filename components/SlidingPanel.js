import React from "react";
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

import Button from "../components/Button";
import {
  FontAwesome,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { responsiveFontSize } from "react-native-responsive-dimensions";

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

const SlidingPanel = props => {
  return (
    <StyledContainer pose={props.pose}>
      <TouchableWithoutFeedback onPress={props.onPressHeader}>
        <PanelHeader>
          <MyText style={{ color: "#FFF" }}>
            {props.selected.length} songs selected
          </MyText>
          <TouchableWithoutFeedback onPress={props.onPressHeader}>
            <View>
              <FontAwesome
                style={{
                  transform: [
                    props.visible ? { rotate: "180deg" } : { rotate: "0deg" }
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
        {!props.selected ||
          (props.selected.length === 0 && (
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

        {props.selected && props.selected.length !== 0 && (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <ScrollView style={{ padding: 30, height: "85%" }}>
              {props.selected.map((track, idx) => (
                <TrackView key={track.id}>
                  <TrackNumber>{idx + 1}.</TrackNumber>
                  <View style={{ flexDirection: "column" }}>
                    <TrackArtist numberOfLines={1}>{track.artist}</TrackArtist>
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
                      onPress={() => props.removeFromList(track.id)}
                    >
                      <Entypo name="cross" size={24} color="#B3BAC8" />
                    </TouchableWithoutFeedback>
                  </View>
                </TrackView>
              ))}
            </ScrollView>
            <ExportButtonView>
              <Button
                color="white"
                onPress={this.export}
                text={"Export to Spotify"}
              >
                <MaterialCommunityIcons name="export" size={24} color="white" />
              </Button>
            </ExportButtonView>
          </View>
        )}
      </SlidingContent>
    </StyledContainer>
  );
};

export default SlidingPanel;
