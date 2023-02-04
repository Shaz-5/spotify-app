import {useState, useEffect} from 'react'
import axios from 'axios'

const useAuth = (access_token, refresh_token,expires_in) => {
    
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(()=>{
        
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setExpiresIn(expires_in);
        setTimeout(()=>{window.history.pushState({}, null, '/');},100);
        
    },[access_token, refresh_token, expires_in])

    useEffect(()=>{
        
        if(!refreshToken || !expiresIn) return

        const interval = setInterval(()=>{

            axios.post("http://localhost:8888/refresh", {refreshToken})
            .then((res)=>{
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch((err)=>{
                window.location = '/';
                console.error(err);
            })
        }, (expiresIn-60)*100);

        return() => clearInterval(interval);

    }, [refreshToken, expiresIn]);

    return ( accessToken );
}
 
export default useAuth;