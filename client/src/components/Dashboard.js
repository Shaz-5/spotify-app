import { Fragment, useEffect, useState } from "react";
import SpotifyWebApi from 'spotify-web-api-node';
import useAuth from "./useAuth";

const spotifyApi = new SpotifyWebApi({
    clientId: '153e4a481a6d461bb2d8c8d1ef3bbcc8'
})

const Dashboard = (props) => {

    const accessToken = useAuth(props.access_token, props.refresh_token, props.expires_in);
    // console.log('AccessToken: ',accessToken)

    return ( 
        <div>
            
        </div>
    );
}
 
export default Dashboard;