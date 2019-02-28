import axios from "axios";
import moment from "moment";
import { Buffer } from "buffer";
import { AuthSession, SecureStore } from "expo";
import querystring from "querystring";
import Analytics from "./Analytics";

const SPOTIFY_CLIENT_ID = "b2ff1c99b3fc459ca733f35ee9f3e068"; // Your client id
const SPOTIFY_CLIENT_SECRET = "cd4e85fd594644fe87df109a814adac1"; // Your secret

const SCOPE =
  "user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public";
const HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization:
    "Basic " +
    new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
      "base64"
    )
};

const getUserID = async () => {
  const accessToken = await getAccessToken();
  const res = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  });

  return res.data.id;
};

const logout = async () => {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
  Analytics.logout();
  AuthSession.dismiss();
};

const getNameAndPicture = async () => {
  const accessToken = await getAccessToken();
  const res = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  });

  return { name: res.data.display_name, image: res.data.images[0].url };
};

const getAccessToken = async () => {
  const tempAccessToken = await SecureStore.getItemAsync("access_token");
  const accessToken = JSON.parse(tempAccessToken) || undefined;
  const refreshToken = await SecureStore.getItemAsync("refresh_token");

  if (accessToken && moment(accessToken.expires) > moment()) {
    return accessToken.token;
  } else if (
    accessToken &&
    refreshToken &&
    moment(accessToken.expires) <= moment()
  ) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    await SecureStore.setItemAsync(
      "access_token",
      JSON.stringify({
        token: newAccessToken,
        expires: moment()
          .add(3600, "seconds")
          .format()
      })
    );
    return newAccessToken;
  }
  return accessToken;
};

const refreshAccessToken = async refresh_token => {
  const body = {
    refresh_token,
    grant_type: "refresh_token"
  };
  const result = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify(body),
    { headers: HEADERS }
  );
  return result.data.access_token;
};

const handleSpotifyLogin = async () => {
  const redirect_uri = AuthSession.getRedirectUrl();
  let results = await AuthSession.startAsync({
    authUrl:
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: SCOPE,
        redirect_uri,
        show_dialog: true
      })
  });

  if (results.type === "success") {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code: results.params.code,
        redirect_uri,
        grant_type: "authorization_code"
      }),
      { headers: HEADERS }
    );

    await SecureStore.setItemAsync(
      "access_token",
      JSON.stringify({
        token: response.data.access_token,
        expires: moment()
          .add(3600, "seconds")
          .format()
      })
    );
    await SecureStore.setItemAsync(
      "refresh_token",
      response.data.refresh_token
    );
    return results;
  } else return results;
};

export {
  getUserID,
  getAccessToken,
  handleSpotifyLogin,
  getNameAndPicture,
  logout
};
