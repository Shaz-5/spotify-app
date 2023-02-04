import { Fragment, useEffect, useState } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";

const spotifyApi = new SpotifyWebApi({
    clientId: '153e4a481a6d461bb2d8c8d1ef3bbcc8'
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
            uris: [`spotify:track:${track}`]
          })
          .then(function(data) {
            console.log('Song is playing on the device with id ', deviceId);
          }).catch(function(err) {
            console.log('Something went wrong!', err);
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

                    const smallestAlbumImage = track.album.images.reduce((smallest, image)=>{
                        if(image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0]);

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
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
            
            <input type="search" placeholder="Search Songs/Artists" value={search}
            onChange={(e)=>{setSearch(e.target.value)}}/>

            <div>{ searchResults.map(track=>{
                return <TrackSearchResult  track = {track} key = {track.uri} chooseTrack={chooseTrack}/>
            })}</div>

        </Fragment>
    );
}
 
export default Dashboard;