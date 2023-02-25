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

                    const biggestAlbumImage = track.album.images.reduce((biggest, image)=>{
                        if(image.height > biggest.height) return image
                        return biggest
                    }, track.album.images[0]);

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: biggestAlbumImage.url
                    }
                })
            )
        })
        .catch((err)=>{
            console.error(err);
        });

        return ()=> cancel = true;
        
    }, [search, accessToken]);

    return ( 
        <Fragment>

            <div style={{margin: '0', height: '300px', position:'relative', background: '#191414', maxWidth: '100%'}}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h1 style={{margin: '0', 
                        position: 'absolute', 
                        color: 'grey', 
                        padding: '20px', 
                        left: '50%', 
                        top: '40%',
                        fontSize: '40px', 
                        transform: 'translate(-50%, -50%)'
                    }}>Play Your <span style={{color: '#1DB954', fontSize: '1.1em'}}>Favourite</span> Music</h1>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <input type="search" placeholder="Search Songs / Artists.." value={search}
                    onChange={(e)=>{setSearch(e.target.value)}} 
                    style={{borderRadius: '20px', 
                        margin:'10px 0', 
                        padding: '10px', 
                        paddingLeft: '10px', 
                        paddingRight: '10px', 
                        border: 'none', 
                        position:'absolute', 
                        height: '35px', 
                        maxHeight: '35px',
                        bottom: '15%', 
                        width: '70%',  
                        left: '50%', 
                        top:'70%', 
                        transform: 'translate(-50%, -50%)'
                    }}/>
                </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',gridGap: '30px', margin: '30px'}}>{ searchResults.map(track=>{
                return <TrackSearchResult  track = {track} key = {track.uri} chooseTrack={chooseTrack}/>
            })}</div>


        {/* <div style={{margin: '0', height: '80px', position:'relative', background: '#191414', maxWidth: '100%', }}>
            <footer style={{margin: '0', position: 'absolute', color: 'grey', padding: '20px', left: '50%', top: '40%', transform: 'translate(-50%, -50%)'}}>Copyright &copy; </footer>
        </div> */}

        </Fragment>
    );
}
 
export default Dashboard;