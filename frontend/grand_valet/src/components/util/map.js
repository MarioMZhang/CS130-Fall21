import React from 'react'
import { Marker, GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '60vh'
};

// const center = {
//     lat: 42.3601,
//     lng: -71.0589
//
// };

const onLoad = marker => {
    console.log('marker: ', marker)
};

function Map(props) {
    var lat = parseFloat(props.center_lat);
    var lng = parseFloat(props.center_lng);
    var marker_crd = props.marker_crd;

    // console.log(marker_crd);
    // console.log(lat);
    // console.log(lng);

    var center = {
        lat: lat,
        lng: lng
    };

    if (marker_crd !== null) {
        console.log(marker_crd[0]);
        console.log(center);
    }

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyCqopOlPulWgXjkLPGysPmroPBl2qm1e_o"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {marker_crd !== null && <Marker onLoad={onLoad} position={center} icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"} />}
                {marker_crd !== null && marker_crd.map(function(each_marker_crd, i) {
                    console.log(each_marker_crd);
                    if (each_marker_crd.lat === props.chosen_lat && each_marker_crd.lng === props.chosen_lng) {
                        return <Marker onLoad={onLoad} position={each_marker_crd} key={i} icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}/>;
                    }
                    return <Marker onLoad={onLoad} position={each_marker_crd} key={i} />;
                })}
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)
