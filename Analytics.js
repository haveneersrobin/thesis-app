import { Amplitude } from "expo";

const events = {
  LOGGED_IN: "LOGGED_IN", // done
  LOGGED_OUT: "LOGGED_OUT", // done
  CONTINUE_NO_LOGIN: "CONTINUE_NO_LOGIN", // done
  ENTER_ARTIST_SELECTION_SCREEN: "ENTER_ARTIST_SELECTION_SCREEN", // done
  EXIT_ARTIST_SELECTION_SCREEN: "EXIT_ARTIST_SELECTION_SCREEN", // done
  SEARCH_ARTIST: "SEARCH_ARTIST", // done
  ENTER_SONGS_SCREEN: "ENTER_SONGS_SCREEN", // done
  EXIT_SONGSS_SCREEN: "EXIT_SONGS_SCREEN", // done
  PLAY_TRACK: "PLAY_TRACK", // done
  PAUSE_TRACK: "PAUSE_TRACK", // done
  ADD_TRACK_TO_PLAYLIST: "ADD_TRACK_TO_PLAYLIST", // done
  REMOVE_TRACK_FROM_PLAYLIST: "REMOVE_TRACK_FROM_PLAYLIST", // done
  DONE: "DONE", // done
  EXPORT_PLAYLIST: "EXPORT_PLAYLIST", // DONE
  OPEN_SLIDERS: "OPEN_SLIDERS",
  CONFIRM_SLIDERS: "CONFIRM_SLIDERS",
  CANCEL_SLIDERS: "CANCEL_SLIDERS"
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
    Amplitude.logEventWithProperties(event, options);
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
