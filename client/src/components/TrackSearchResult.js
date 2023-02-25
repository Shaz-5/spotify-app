const TrackSearchResult = ({track, chooseTrack}) => {

    const handlePlay = ()=>{
        chooseTrack(track);
    };

    return ( 
        <div style={{cursor: "pointer", position:'relative', overflow: 'hidden', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'}} onClick={handlePlay}>
            <img src={track.albumUrl} alt="Song Cover" style={{height: "64px", width:"64px", display: 'block', width: '100%', height: 'auto'}} />
            <div>
                <div style={{padding: '10px', }}>{track.title}</div>
                <div style={{padding: '10px', color: 'grey', fontSize: '0.9em'}}>{track.artist}</div>
            </div>
        </div>
     );
}
 
export default TrackSearchResult;