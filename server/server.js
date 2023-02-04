require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');

const app = express();

app.use(cors());

const redirect_uri = process.env.REDIRECT_URI;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri
});

const scopes = ['user-read-private', 'user-read-email', 'streaming', 'user-library-read', 'user-library-modify', 'user-read-playback-state', 'user-modify-playback-state'];

const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// LOGIN
app.get('/login', (req, res) => {

    res.redirect(authorizeURL);

});

// CALLBACK
app.get('/callback', (req, res) => {
    
    const code = req.query.code || null;

    spotifyApi.authorizationCodeGrant(code)
    .then(
        function(data) {

            const access_token = data.body.access_token;
            const refresh_token = data.body.refresh_token;
            const expires_in = data.body.expires_in;

            // res.json({
            //     accessToken: access_token,
            //     refreshToken: refresh_token,
            //     expiresIn: expires_in
            // })

            res.redirect('http://localhost:3000/#' + querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token,
                expires_in: expires_in
            }));
        },
        function(err) {
            res.redirect('http://localhost:3000/#' + querystring.stringify({error: 'invalid_token'}));
            console.log('Invalid Token! : ', err);
        }
    );
});

// REFRESH
app.get('/refresh', (req, res) => {

    const { refresh_token } = req.body.refreshToken;
    spotifyApi.setRefreshToken(refresh_token);

    spotifyApi.refreshAccessToken().then(
        function(data) {
            console.log('The access token has been refreshed!');
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        },
        function(err) {
            console.log('Could not refresh access token : ', err.message);
        }
    );
    
});

app.listen(8888);