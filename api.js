import axios from "axios";
import moment from "moment";
import { Buffer } from "buffer";
import { AuthSession, SecureStore } from "expo";
import querystring from "querystring";

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
  return await res.data.id;
};

const getAccessToken = async () => {
  const accessToken = JSON.parse(
    await SecureStore.getItemAsync("access_token")
  );
  if (moment(accessToken.expires) > moment()) {
    return accessToken.token;
  } else {
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    const body = {
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    };
    return axios
      .post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify(body),
        { headers: HEADERS }
      )
      .then(async response => {
        await SecureStore.setItemAsync(
          "access_token",
          JSON.stringify({
            token: response.data.access_token,
            expires: moment()
              .add(3600, "seconds")
              .format()
          })
        );
        return response.data.access_token;
      });
  }
};

const handleSpotifyLogin = async () => {
  const redirectUrl = AuthSession.getRedirectUrl();
  var results = await AuthSession.startAsync({
    authUrl:
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: SCOPE,
        redirect_uri: redirectUrl
      })
  });
  if (results.type !== "success") {
    // Results is an object and contains errorCode, params, type, url
    return results;
  } else {
    const body = {
      code: results.params.code,
      redirect_uri: redirectUrl,
      grant_type: "authorization_code"
    };

    return axios
      .post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify(body),
        { headers: HEADERS }
      )
      .then(async response => {
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
        results.response = response;
        return results;
      })
      .catch(error => {
        results = { type: "error", errorCode: error };
        return results;
      });
  }
};

export { getUserID, getAccessToken, handleSpotifyLogin };
