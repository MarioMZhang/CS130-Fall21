import React from "react";
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
import Map from './../../util/map';
import {HTTPHandler} from "../../util/http";


// import TimePicker from 'react-time-picker';



// This is the page where user select the hub and fill out the form


const theme = createTheme();

const state_options = ["California", "New York"];


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
    { title: "Spots", field: "Spots"},
    { title: "Open Time", field:"Opentime" },
    { title: "Close Time", field:"Closetime" },
    { title: "Availability", field: "Available", align: "center", formatter: "tickCross" }
];

var table_data = [
    {id:1, Description:"South of UCLA", Distance: 3.5, Spots: 7, Opentime: 12512313, Closetime: 12333333, Available: true, longitude: -118.462, latitude: 34.0689},
    {id:2, Description:"Westwood", Distance: 13.5, Spots: 1, Opentime: 12512313, Closetime: 12333333, Available: true,  longitude: -118.39, latitude: 34.2},
    {id:3, Description:"Target", Distance: 1.2, Spots: 0, Opentime: 12512313, Closetime: 12333333, Available: false, longitude: -118.482, latitude: 34.092},
    {id:4, Description:"Hammer Museum", Distance: 5.9, Spots: 12, Opentime: 12512313, Closetime: 12333333, Available: true, longitude: -118.410, latitude: 34.0633},
    {id:5, Description:"Wilshire", Distance: 4.6, Spots: 9, Opentime: 12512313, Closetime: 12333333, Available: false, longitude: -118.45, latitude: 34.0591},
];

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};


// The function used to periodically get available hubs.
function getHubs() {

}

// The function used to convert the HTTP response body (dummyHubs) into the correct format (table_column, table_data).
function convertHubList() {



    return dummyHubs;
}


function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


export default class PickupIP extends React.Component{
    // el = React.createRef();
    // tabulator = null; //variable to hold your table

    constructor(props) {
        super(props);
        this.state = {
            user_lat: 0,
            user_lng: 0,
            marker_crd: null,
            chosen_hub: null,
            chosen_lat: null,
            chosen_lng: null,
            car_lat: null,
            car_lng: null,
            code: 0,
        };
    }



    setUserLocation = (pos) => {
        var crd = pos.coords;

        this.setState({
            user_lat: crd.latitude,
            user_lng: crd.longitude,
        });

        console.log(crd.latitude);
        console.log(crd.longitude);
    };


    tableRowClicked = (e, row) => {
        console.log(row._row.data);
        var data = row._row.data;

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

    handleCodeSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        var jobId = parseInt((new URL(window.location.href)).searchParams.get("id"));
        var code = parseInt(data.get('code'));
        console.log(code);

        var handler = new HTTPHandler();
        handler.asyncGetJobsFromID(jobId)
            .then(response => {
                response.advanceState = [1, response.advanceState[1]];
                return response;
            })
            .then(updated => {
                if (code === parseInt(updated.code)) {
                    handler.asyncPostJob(updated)
                        .then(response => {
                            console.log(response);
                            if (response.hasOwnProperty("jobId")) {
                                console.log("success");
                                // advance only when both customer and driver confirm
                                if (response.advanceState[0] === 1 && response.advanceState[1] === 1) {
                                    window.location.href = "/customer?stage=schedule";
                                }
                            } else {
                                window.alert("Failed to update verification code.");
                            }
                        })
                        .catch(err => console.log(err.toString()));
                } else {
                    window.alert("The verification codes doesn't match. Please double check with ur driver.");
                }
            })
            .catch(err => console.log(err.toString()));
    };

    componentDidMount() {
        // retrieve list of hubs.
        // convert response body into table data.

        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    if (result.state === "granted") {
                        console.log(result.state);
                        navigator.geolocation.getCurrentPosition(this.setUserLocation);
                    } else if (result.state === "prompt") {
                        console.log(result.state);
                        navigator.geolocation.getCurrentPosition(this.setUserLocation, errors, options);
                    } else if (result.state === "denied") {
                        window.alert("Please enable geolocation!!");
                    }
                });
        }

        var marker_crd = [];

        // for (let i = 0; i < table_data.length; i ++) {
        //     marker_crd.push({lat: table_data[i].latitude, lng: table_data[i].longitude});
        // }

        marker_crd.push({lat: this.state.chosen_lat, lng: this.state.chosen_lng});
        marker_crd.push({lat: this.state.car_lat, lng: this.state.car_lng});

        this.setState({
            marker_crd: marker_crd
        })

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
                        <div style={{display: 'flex',  justifyContent:'center', "width":"100%", "height":"100%"}}>
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
                            <Typography component="h1" variant="h5">
                                Pick up in progress
                            </Typography>
                            <Box data-testid="schedule-form" component="form" onSubmit={this.handleCodeSubmit} noValidate sx={{ mt: 1 }} >
                                Verification code:
                                <div style={{display:"flex", flexDirection:"row"}}>

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="code"
                                        id="code"
                                        autoFocus
                                        style={{padding:5}}
                                        defaultValue={this.state.code}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Cancel
                                </Button>

                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

