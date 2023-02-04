const TrackSearchResult = ({track, chooseTrack}) => {

    const handlePlay = ()=>{
        chooseTrack(track);
    };

    return ( 
        <div style={{cursor: "pointer"}} onClick={handlePlay}>
            <img src={track.albumUrl} alt="Song Cover" style={{height: "64px", width:"64px"}} />
            <div>
                <div>{track.title}</div>
                <div>{track.artist}</div>
            </div>
        </div>
     );
}
 
export default TrackSearchResult;