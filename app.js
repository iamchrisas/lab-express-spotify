require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

//route for the artist search
app.get("/artist-search", (req, res) => {
  // The query is received from the search form via the request's query string
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      //render a page with the results
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
      res.status(500).send("Artist search failed");
    });
});

//route to view the artist's albums
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((err) => {
      console.log("Error while getting albums", err);
      res.status(500).send("Error while getting albums");
    });
});

//route to view album's tracks
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((data) => {
      res.render("tracks", {
        tracks: data.body.items,
        albumId: req.params.albumId,
      });
    })
    .catch((err) => {
      console.log("Error while getting tracks", err);
      res.status(500).send("Error while getting tracks");
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
