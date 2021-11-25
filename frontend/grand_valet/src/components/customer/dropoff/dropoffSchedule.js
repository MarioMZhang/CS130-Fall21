import React, {createRef} from "react";
import './dropoffSChedule.css';
import 'react-tabulator/lib/styles.css';
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import Map from './../../util/map'
import {HTTPHandler} from './../../util/http';
import $ from "jquery";




// This is the page where user select the hub and fill out the form


const theme = createTheme();


const dummyHubs = [
    {
        hub_ID: 1,
        Description: "South entry of Bruin Plaza",
        Latitude: "34.16238",
        Longitude: "-147.2333",
        Distance: "3.86",
        Open_time: 1635313479,
        Close_time: 1635314479,
    },
    {
        hub_ID: 1,
        Description: "UCLA",
        Latitude: "34.16238",
        Longitude: "-147.2333",
        Distance: "3.86",
        Open_time: 1635313479,
        Close_time: 1635314479,
    },
];

const table_columns = [
    { title: "ID", field: "id"},
    { title: "Description", field: "Description"},
    { title: "Distance", field: "Distance" },
    // { title: "Spots", field: "Spots"},
    { title: "Open Time", field:"Opentime" },
    { title: "Close Time", field:"Closetime" },
    // { title: "Availability", field: "Available", align: "center", formatter: "tickCross" }
];

// var table_data = [
//     {id:1, Description:"South of UCLA", Distance: 3.5, Spots: 7, Opentime: 12512313, Closetime: 12333333, Available: true, longitude: -118.462, latitude: 34.0689},
//     {id:2, Description:"Westwood", Distance: 13.5, Spots: 1, Opentime: 12512313, Closetime: 12333333, Available: true,  longitude: -118.39, latitude: 34.2},
//     {id:3, Description:"Target", Distance: 1.2, Spots: 0, Opentime: 12512313, Closetime: 12333333, Available: false, longitude: -118.482, latitude: 34.092},
//     {id:4, Description:"Hammer Museum", Distance: 5.9, Spots: 12, Opentime: 12512313, Closetime: 12333333, Available: true, longitude: -118.410, latitude: 34.0633},
//     {id:5, Description:"Wilshire", Distance: 4.6, Spots: 9, Opentime: 12512313, Closetime: 12333333, Available: false, longitude: -118.45, latitude: 34.0591},
// ];

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km

    console.log(d);
    return Number(d.toPrecision(3));
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}


export default class DropoffSchedule extends React.Component{
    // el = React.createRef();
    // tabulator = null; //variable to hold your table

    constructor(props) {
        super(props);
        this.state = {
            user_lat: 0,
            user_lng: 0,
            table_ref: createRef(),
            show_warning: false,
            marker_crd: null,
            chosen_hub: null,
            chosen_lat: null,
            chosen_lng: null,
            table_data: []
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            license: data.get('license'),
            state: data.get('issuedState'),
            hour: data.get('hour'),
            minute: data.get('minute')
        });

        var scheduled_time = new Date();
        scheduled_time.setHours(parseInt(data.get('hour').toString()));
        scheduled_time.setMinutes(parseInt(data.get('minute').toString()));

        var json_data = {
            "type": 1,
            "jobId": 0,
            "scheduledTime": Math.floor(scheduled_time.getTime() / 1000),
            "status": 1,
            "licenceState": data.get('issuedState'),
            "licenceNum": data.get('license'),
            "hubId": this.state.chosen_hub.id,
            "customerUsername": "customer1",
            "code": null,
            "carLocation": null,
            "note": null,
            "driverUsername": null,
            "advanceState": [0, 0]
        };

        console.log(json_data);

        let handler = new HTTPHandler();
        handler.asyncPostJob(json_data)
            .then(status => {
               if (status !== 201) {
                   window.alert("Failed to create new job with a error code of " + status.toString());
               } else {
                   window.location.href = "/customer?stage=ip";
               }
            });

    };

    setUserLocation = (pos) => {
        var crd = pos.coords;

        this.setState({
            user_lat: crd.latitude,
            user_lng: crd.longitude,
        });
    };


    tableRowClicked = (e, row) => {
        var data = row._row.data;

        console.log(data.latitude);

        this.setState({
            chosen_hub: {
                id: data.id,
                description: data.Description,
                distance: data.Distance,
            },
            chosen_lat: data.latitude,
            chosen_lng: data.longitude,
        });
    };

    updateTable = () => {
        let handler = new HTTPHandler();
        handler.asyncGetHubs()
            .then(hubs => {
                var res = [];

                for (let i = 0; i < hubs.length; i ++) {
                    const cur = hubs[i];
                    var temp = {
                        id: cur.hubId,
                        Description: cur.description,
                        Distance: getDistanceFromLatLonInKm(cur.location[1], cur.location[0], this.state.user_lat, this.state.user_lng),
                        Opentime: new Date(cur.startTime * 1000).toTimeString(),
                        Closetime: new Date(cur.endTime * 1000).toTimeString(),
                        latitude: cur.location[1],
                        longitude: cur.location[0]
                    };
                    res.push(temp);
                }

                this.setState({table_data: res});

                var marker_crd = [];

                for (let i = 0; i < this.state.table_data.length; i ++) {
                    marker_crd.push({lat: this.state.table_data[i].latitude, lng: this.state.table_data[i].longitude});
                }

                this.setState({
                    marker_crd: marker_crd
                })
            });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateTable();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.user_lat === nextState.user_lat && this.state.chosen_lat === nextState.chosen_lat) {
            this.state.table_ref.current.table.replaceData(this.state.table_data);
            return false;
        }

        return true;
    }


    componentDidMount() {
        // retrieve list of hubs.
        // convert response body into table data.


        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(this.setUserLocation);
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(this.setUserLocation, errors, options);
                    } else if (result.state === "denied") {
                        window.alert("Please enable geolocation!!");
                    }
                })
                .then(() => {
                    this.updateTable();
                })
        }



        // let handler = new HTTPHandler();
        // handler.asyncGetHubs()
        //     .then(hubs => {
        //         var res = [];
        //
        //         for (let i = 0; i < hubs.length; i ++) {
        //             const cur = hubs[i];
        //             var temp = {
        //                 id: cur.hubId,
        //                 Description: cur.description,
        //                 Distance: getDistanceFromLatLonInKm(cur.location[1], cur.location[0], this.state.user_lng, this.state.user_lat),
        //                 Opentime: new Date(cur.startTime * 1000).toString(),
        //                 Closetime: new Date(cur.endTime * 1000).toString(),
        //                 latitude: cur.location[1],
        //                 longitude: cur.location[0]
        //             };
        //             res.push(temp);
        //         }
        //
        //         this.setState({table_data: res});
        //
        //         var marker_crd = [];
        //
        //         for (let i = 0; i < this.state.table_data.length; i ++) {
        //             marker_crd.push({lat: this.state.table_data[i].latitude, lng: this.state.table_data[i].longitude});
        //         }
        //
        //         this.setState({
        //             marker_crd: marker_crd
        //         })
        //     });
    }

    //add table holder element to DOM
    render(){

        return (
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div data-testid="schedule-table" id="hubTableContainerstyle" style={{"width":"100%", "height":"40%"}}>
                            <ReactTabulator
                                ref={this.state.table_ref}
                                columns={table_columns}
                                data={this.state.table_data}
                                rowClick={this.tableRowClicked}
                                layout="fitDataFill"
                                className="hubClass"
                            />
                        </div>
                        <div style={{display: 'flex',  justifyContent:'center'}}>
                            <Map data-testid="schedule-map" center_lat={this.state.user_lat} center_lng={this.state.user_lng} marker_crd={this.state.marker_crd} chosen_lat={this.state.chosen_lat} chosen_lng={this.state.chosen_lng}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {this.state.chosen_hub && <p>You have selected hub {this.state.chosen_hub.id} that is {this.state.chosen_hub.distance} miles away from you.</p>}
                            <Typography component="h1" variant="h5">
                                Schedule Drop Off
                            </Typography>
                            <Box data-testid="schedule-form" component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }} >
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="license"
                                        label="License Plate"
                                        id="license"
                                        autoFocus
                                        style={{padding:5}}
                                        disabled={this.state.chosen_hub === null}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="issuedState"
                                        label="Issued State"
                                        id="issuedState"
                                        autoFocus
                                        style={{padding:5}}
                                        disabled={this.state.chosen_hub === null}

                                    />
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="hour"
                                        label="Drop Off Hour "
                                        id="hour"
                                        autoFocus
                                        style={{padding:5}}
                                        disabled={this.state.chosen_hub === null}

                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="minute"
                                        label="Drop Off Minute "
                                        id="minute"
                                        autoFocus
                                        style={{padding:5}}
                                        disabled={this.state.chosen_hub === null}

                                    />
                                </div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Submit Request
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

