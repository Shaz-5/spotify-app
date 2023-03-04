const TrackSearchResult = ({track, chooseTrack}) => {

    const handlePlay = ()=>{
        chooseTrack(track);
    };

    return ( 
        <div className="result_item" onClick={handlePlay}>
            <img className="result_item_img" src={track.albumUrl} alt="Song Cover"/>
            <div>
                <div style={{padding: '10px', }}>{track.title}</div>
                <div style={{padding: '10px', color: 'grey', fontSize: '0.9em'}}>{track.artist}</div>
            </div>
        </div>
     );
}
 
export default TrackSearchResult;