import { Buffer } from "buffer";

export const SPOTIFY_CLIENT_ID = "b2ff1c99b3fc459ca733f35ee9f3e068";
export const SPOTIFY_CLIENT_SECRET = "cd4e85fd594644fe87df109a814adac1";

export const SCOPE =
  "user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public";

export const POST_HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization:
    "Basic " +
    new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
      "base64"
    )
};

export const GET_HEADERS = accessToken => ({
  Authorization: "Bearer " + accessToken
});
