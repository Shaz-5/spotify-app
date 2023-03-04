import { Fragment, useEffect, useState } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";

const spotifyApi = new SpotifyWebApi({
    clientId: '370e3967807b42af8ef11a6464151d84'
})

const Dashboard = (props) => {

    const accessToken = useAuth(props.access_token, props.refresh_token, props.expires_in);
    // console.log('AccessToken: ',accessToken)

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [deviceId, setDeviceId] = useState("");
    const [popular, setPopular] = useState([]);

    useEffect(()=>{

        if(!accessToken) {
            return 
        }
        else {
            spotifyApi.setAccessToken(accessToken);

            spotifyApi.getMyDevices()
            .then(function(data) {
                const deviceId = (data.body.devices[0].id);
                // console.log(deviceId);
            }).catch(function(err) {
                console.log('Something went wrong!', err);
            });
        }

    }, [accessToken]);

    function chooseTrack(track) {
        spotifyApi.play({
            device_id: deviceId,
            uris: [`${track.uri}`]
          })
          .then(function(data) {
            console.log('Song is playing on the device', deviceId);
          }).catch(function(err) {
            console.log('Something went wrong!', err.message);
          });
    }

    // Search
    useEffect(()=>{

        if(!search) return setSearchResults([])
        if(!accessToken) return

        let cancel = false;
        spotifyApi.searchTracks(search)
        .then((res)=>{
            if(cancel) return
            setSearchResults(
                res.body.tracks.items.map((track)=>{
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: track.album.images[1].url,
                    }
                })
            )
        })
        .catch((err)=>{
            console.error(err);
        });

        return ()=> cancel = true;
        
    }, [search, accessToken]);

    useEffect(()=>{
        
        if(!accessToken) return
        spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF')
        .then((res)=>{
            setPopular(
                res.body.items.map((track)=>{
                    return {
                        artist: track.track.artists[0].name,
                        title: track.track.name,
                        uri: track.track.uri,
                        albumUrl: track.track.album.images[1].url,
                    }
                })
            )
        })
        .catch((err)=>{
            console.error(err);
        });

    }, [accessToken, popular]);

    return ( 
        <Fragment>

            <div className="header_background">
                <div className="title_div">
                    <h1 className="title">Play Your <span style={{color: '#1DB954', fontSize: '1.1em'}}>Favourite</span> Music</h1>
                </div>
                {/* <img className="spotify_logo" src={process.env.PUBLIC_URL + '/Spotify_Logo_RGB_Green.png'} alt="Spotify" /> */}

                <div className="search_div">
                    <input className="search" type="search" placeholder="Search Songs / Artists.." value={search} onChange={(e)=>{setSearch(e.target.value)}} />
                </div>
            </div>

            {!search && <h2 style={{padding: '5px', marginLeft: '25px'}}>Most <span style={{color: '#1DB954'}}>Popular</span> Right Now</h2>}
            {!search && <div className="results">{ popular.map(track=>{
                return <TrackSearchResult  track = {track} key = {track.uri} chooseTrack={chooseTrack}/>
            })}</div>}

            {search && <div className="results">{ searchResults.map(track=>{
                return <TrackSearchResult  track = {track} key = {track.uri} chooseTrack={chooseTrack}/>
            })}</div>}

            <div style={{height: '191px'}}></div>
            <div className="footer_div">
                <footer className="footer">
                    Copyright &copy;
                </footer>
            </div>

        </Fragment>
    );
}
 
export default Dashboard;