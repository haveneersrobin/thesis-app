import axios from "axios";
import moment from "moment";
import { AuthSession, SecureStore, Constants } from "expo";
import querystring from "querystring";
import Analytics from "./Analytics";
import { alertError } from "./utils";
import * as env from "./env";

const getUserID = async () => {
  let res;
  try {
    const accessToken = await getAccessToken();
    const userID = axios.get("https://api.spotify.com/v1/me", {
      headers: env.GET_HEADERS(accessToken)
    });
    res = accessToken ? await userID : undefined;
  } catch (error) {
    alertError(error);
    alertError("getUserId");
  }

  if (res) return res.data.id;
  else return undefined;
};

const logout = async () => {
  try {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
  } catch (error) {
    alertError(error);
    alertError("logout");
  }
  Analytics.logout();
  AuthSession.dismiss();
};

const getNameAndPicture = async () => {
  let res;
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      res = await axios.get("https://api.spotify.com/v1/me", {
        headers: env.GET_HEADERS(accessToken)
      });
    } else {
      return undefined;
    }
  } catch (error) {
    alertError("getNameAndPicture " + error);
  }
  if (res.data) {
    return {
      name: res.data.display_name,
      image: res.data.images.length == 0 ? undefined : res.data.images[0].url
    };
  } else return undefined;
};

const getAccessToken = async () => {
  let accessToken, refreshToken;
  try {
    accessToken = JSON.parse(await SecureStore.getItemAsync("access_token"));
    refreshToken = await SecureStore.getItemAsync("refresh_token");
  } catch (error) {
    alertError(error);
    alertError(
      "Could not retrieve access token or refresh token from Secure Store. "
    );
  }

  if (accessToken && moment(accessToken.expires) > moment())
    return accessToken.token;
  else if (
    accessToken &&
    refreshToken &&
    moment(accessToken.expires) <= moment()
  ) {
    try {
      accessToken = await refreshAccessToken(refreshToken);
      await SecureStore.setItemAsync(
        "access_token",
        JSON.stringify({
          token: accessToken,
          expires: moment()
            .add(3600, "seconds")
            .format()
        })
      );
      return accessToken;
    } catch (error) {
      alertError(error);
      alertError("Can not refresh acces token");
    }
  }
  return accessToken;
};

const refreshAccessToken = async refresh_token => {
  let result;
  const body = {
    refresh_token,
    grant_type: "refresh_token"
  };
  try {
    result = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(body),
      { headers: env.POST_HEADERS }
    );
  } catch (error) {
    alertError(error);
    alertError("Can not refresh acces token");
  }
  return result.data.access_token;
};

const handleSpotifyLogin = async () => {
  let results;
  const redirect_uri = AuthSession.getRedirectUrl();
  try {
    results = await AuthSession.startAsync({
      authUrl:
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: env.SPOTIFY_CLIENT_ID,
          scope: env.SCOPE,
          show_dialog: true,
          redirect_uri
        })
    });
  } catch (error) {
    alertError("Could not start AuthSession");
  }
  if (results.type === "success") {
    let response;
    try {
      response = await axios.post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
          code: results.params.code,
          redirect_uri,
          grant_type: "authorization_code"
        }),
        { headers: env.POST_HEADERS }
      );
    } catch (error) {
      alertError(error);
      alertError("Could not retrieve tokens from Spotify.");
    }
    try {
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
    } catch (error) {
      alertError(error);
      alertError("Could not store access token or refresh token.");
    }
  } else return results;
};

export {
  getUserID,
  getAccessToken,
  handleSpotifyLogin,
  getNameAndPicture,
  logout
};
