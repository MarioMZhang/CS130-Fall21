import React from "react";
import 'react-tabulator/lib/styles.css';
import { ReactTabulator } from 'react-tabulator'
import 'react-tabulator/css/bootstrap/tabulator_bootstrap.min.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


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
    { title: "Spots", field: "Spots"},
    { title: "Open Time", field:"Opentime" },
    { title: "Close Time", field:"Closetime" },
    { title: "Availability", field: "Available", align: "center", formatter: "tickCross" }
];

var table_data = [
    {id:1, Description:"South of UCLA", Distance: 3.5, Spots: 7, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:2, Description:"Westwood", Distance: 13.5, Spots: 1, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:3, Description:"Target", Distance: 1.2, Spots: 0, Opentime: 12512313, Closetime: 12333333, Available: false},
    {id:4, Description:"Hammer Museum", Distance: 5.9, Spots: 12, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:5, Description:"Wilshire", Distance: 4.6, Spots: 9, Opentime: 12512313, Closetime: 12333333, Available: false},
];



// The function used to periodically get available hubs.
function getHubs() {

}

// The function used to convert the HTTP response body (dummyHubs) into the correct format (table_column, table_data).
function convertHubList() {



    return dummyHubs;
}



export default class DropoffSchedule extends React.Component{
    el = React.createRef();
    tabulator = null; //variable to hold your table

    componentDidMount() {
        // retrieve list of hubs.
        // convert response body into table data.
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
                        <div id="hubTableContainerstyle" style={{"width":"90%", "height":"70%"}}>
                            <ReactTabulator
                                columns={table_columns}
                                data={table_data}
                                rowClick={this.rowClick}
                                className="hubClass"
                            />
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
                                Schedule Dropoff
                            </Typography>
                            <Box component="form" noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                                <br/>
                                <br/>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
}

