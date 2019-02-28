import { Amplitude } from "expo";

const events = {
  LOGGED_IN: "LOGGED_IN",
  CONTINUE_NO_LOGIN: "CONTINUE_NO_LOGIN",
  ENTER_ARTIST_SELECTION_SCREEN: "ENTER_ARTIST_SELECTION_SCREEN",
  EXIT_ARTIST_SELECTION_SCREEN: "EXIT_ARTIST_SELECTION_SCREEN",
  SEARCH_ARTIST: "SEARCH_ARTIST",
  ENTER_SONGS_SCREEN: "ENTER_SONGS_SCREEN",
  EXIT_SONGSS_SCREEN: "EXIT_SONGS_SCREEN",
  PLAY_TRACK: "PLAY_TRACK",
  PAUSE_TRACK: "PAUSE_TRACK",
  ADD_TRACK_TO_PLAYLIST: "ADD_TRACK_TO_PLAYLIST",
  DONE: "DONE",
  EXPORT_PLAYLIST: "EXPORT_PLAYLIST",
  OPEN_SLIDERS: "OPEN_SLIDERS",
  CHANGE_SLIDER: "CHANGE_SLIDER",
  CLOSE_SLIDER: "CLOSE_SLIDER",
  LOGGED_OUT: "LOGGED_OUT"
};

let isInitialized = false;
const apiKey = "0f292b2bf2fb788d477f5b82308068b2";

const logout = () => {
  if (isInitialized) {
    Analytics.track(Analytics.events.USER_LOGGED_OUT);
    Amplitude.initialize(null);
    isInitialized = false;
  }
};

const initialize = () => {
  if (!isInitialized) {
    Amplitude.initialize(apiKey);
    isInitialized = true;
  }
};

const identify = id => {
  initialize();
  if (id) Amplitude.setUserId(id);
};

const track = (event, options) => {
  initialize();
  if (options) {
    Amplitude.logEvent(event);
  } else {
    Amplitude.logEvent(event);
  }
};

export default {
  events,
  track,
  identify,
  logout
};
