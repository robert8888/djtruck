import React, { useRef, useEffect } from "react"
import { formater } from "./../../../../../../../utils/time/timeFromater";
import { connect } from "react-redux";


const TrackDuration = ({duration, pitch}) => {
    const container = useRef(null);

    useEffect(()=>{
        let seconds = duration;
        if(typeof duration === "string"){
            seconds = formater.ptToSeconds(duration);
        }

        container.current.textContent = formater.secondsToStr(seconds / (1 + pitch / 100));
    }, [ container, duration, pitch])

    return (
        <span className="track-duration" ref={container}/>
    )
}

const mapsStateToProps = (state, ownProps) => ({
    duration : state.console.channel[ownProps.name].track.duration,
    pitch: state.console.channel[ownProps.name].playBackState.pitch.current,
})

export default connect(mapsStateToProps)(TrackDuration);