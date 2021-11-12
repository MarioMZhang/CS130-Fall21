import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import {reactFormatter, ReactTabulator} from "react-tabulator";
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// function SimpleButton(props) {
//     const rowData = props.cell._cell.row.data;
//     const cellValue = props.cell._cell.value || "Confirm";
//     return <button onClick={() => alert(rowData.name)}>{cellValue}</button>;
// }

var fake_job = [
    {
        "type": 1,
        "jobId": 1,
        "scheduledTime": 1635313499,
        "status": 0,
        "licenceState": "CO",
        "licenceNum": "CABD12",
        "hubId": 1,
        "code": 132561,
        "carLocation": null,
        "note": null,
        "driverUsername": null,
        "customerUsername": "smarsh",
        "advanceState": [0, 0]
    }]

const theme = createTheme();

var printIcon = function(cell, formatterParams, onRendered){ //plain text value
    return "<button>Confirm</button>";
};

const table_columns = [
    { title: "hubId", field: "hubId"},
    { title: "licenceState", field: "licenceState"},
    { title: "licenceNum", field: "licenceNum" },
    { title: "scheduledTime", field: "scheduledTime"}
    // { title: "Open Time", field:"Opentime" },
    // { title: "Close Time", field:"Closetime" },
    // {
    //     title: "Confirm",
    //     align: "center",
    //     formatter: printIcon,
    //     cellClick: function (e, cell) {
    //         if (window.confirm('Are you sure you wish to confirm this task? \n(please make sure you have gotten paid)')) {
    //             cell.getRow().delete();
    //         }
    //     }}

];

var job_data = [
    {type: 1, id: 1, scheduledTime: 1635313499, status: 0, licenceState: "co", licenceNum: "CABD12", hubId: 1, code: 132561, carLocation: null, note: null, driverUsername: null, customerUsername: "smarsh", advanceState: [0,0]},
    {type: 1, id: 2, scheduledTime: 1554423678, status: 0, licenceState: "ca", licenceNum: "CA823YU", hubId: 2, code: 123456, carLocation: null, note: null, driverUsername: null, customerUsername: "jack", advanceState: [0,0]},
    {type: 1, id: 3, scheduledTime: 1635313499, status: 0, licenceState: "ny", licenceNum: "89SFD21", hubId: 3, code: 113344, carLocation: null, note: null, driverUsername: null, customerUsername: "mike", advanceState: [0,0]}
]
var hub_data = [
    {id:1, Description:"South of UCLA", Distance: 3.5, Spots: 7, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:2, Description:"Westwood", Distance: 13.5, Spots: 1, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:3, Description:"Target", Distance: 1.2, Spots: 0, Opentime: 12512313, Closetime: 12333333, Available: false},
    {id:4, Description:"Hammer Museum", Distance: 5.9, Spots: 12, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:5, Description:"Wilshire", Distance: 4.6, Spots: 9, Opentime: 12512313, Closetime: 12333333, Available: false},
];
export default class Joblist extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            status: -1,
            code: -1,
            hubId: -1,
            carLocNote: "",
            scheduleBreak: false,
            breakLength: 10,
            inBreak: false
        };
    }


    handleDropdown = (e) => {
        this.setState({
            breakLength: e.target.value
        })
    }

    handleBreak = () => {
        console.log("schedule a break");
        this.setState({
            scheduleBreak: true
        });
    }

    handleTextField = (v) => {
        this.setState({
            carLocNote: v
        });
    }
    handleBackClick = () => {
        console.log("handle back click");
        // for (var i = 0; i < job_data.length; i++) {
        //     if (job_data[i].id === this.state.id) {
        //         job_data[i].status = this.state.status;
        //     }
        // }
        this.setState({
            id: -1,
            status: -1,
            code: -1,
            hubId: -1
        });
    }
    handleParkConfirm = () => {
        console.log("save notes for car location");
        for (var i = 0; i < job_data.length; i++) {
            if (job_data[i].id === this.state.id) {
                job_data[i].carLocation = this.state.carLocNote;
            }
        }
        console.log(this.state.carLocNote);

        this.setState({
            status: this.state.status + 1
        });
        console.log(this.state.status);
    }

    handleKeyConfirm = () => {
        console.log("handle key confirm");
        for (var i = 0; i < job_data.length; i++) {
            if (job_data[i].id === this.state.id) {
                job_data[i].status = this.state.status + 1; // job is done TODO: change to API
                job_data[i].driverUsername = "Guy";
                job_data.splice(i, 1);
            }
        }
        this.setState({
            id: -1,
            status: -1,
            code: -1,
            hubId: -1
        });
    }

    handleConfirm = () => {
        console.log("handle confirm");
        this.setState({
            status: this.state.status + 1
        });
    }

    tableRowClicked = (e, row) => {
        console.log("table row clicked");
        console.log("row id:"+row._row.data.id);
        var data = row._row.data;
        var hub = data.hubId
        var dpt = null;
        for (var i = 0; i < hub_data.length; i++) {
            if (hub_data[i].id === hub) {
                dpt = hub_data[i].Description
            }
        }
        this.setState({
            id: data.id,
            status: data.status,
            code: data.code,
            hub: dpt
        });
    };

    render(){
        console.log("current status")
        console.log(this.state.status);
        if (this.state.inBreak || (this.state.scheduleBreak && job_data.length === 0)) {
            if (!this.state.inBreak) {
                this.setState({
                    inBreak: true
                });
            }
        }

        if (this.state.status === -1) {
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
                                // backgroundColor: (t) =>
                                //     t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div id="hubTableContainerstyle" style={{"width":"90%", "height":"70%"}}>
                                <ReactTabulator
                                    columns={table_columns}
                                    data={job_data}
                                    hub={this.state.hub}
                                    rowClick={this.tableRowClicked}
                                    className="jobClass"
                                />
                            </div>
                            {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
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
                                <Box component="form" noValidate sx={{ mt: 1 }}>
                                    <br/>
                                    <FormControl sx={{ m:1, midWidth: 180 }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Minute</InputLabel>
                                        <Select
                                            autoWidth
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.breakLength}
                                            label="time"
                                            onChange={this.handleDropdown}
                                        >

                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                            <MenuItem value={40}>40</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={60}>60</MenuItem>
                                            <MenuItem value={90}>90</MenuItem>
                                            <MenuItem value={120}>120</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <br/>
                                    <Button
                                        onClick={this.handleBreak}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Break
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );
        }
        else if (this.state.status === 0) {
            return(
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
                                // backgroundColor: (t) =>
                                //     t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div id="hubTableContainerstyle" style={{"width":"90%", "height":"70%"}}>
                                <ReactTabulator
                                    columns={table_columns}
                                    data={job_data}
                                    rowClick={this.tableRowClicked}
                                    className="jobClass"
                                />
                            </div>
                            {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
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
                                    Pick Car up at ...
                                </Typography>
                                <Box component="form" noValidate sx={{ mt: 1 }}>
                                    Address:
                                    <br/>
                                    {this.state.hub}
                                    <br/>
                                    <br/>
                                    Verification Code:
                                    <br/>
                                    {this.state.code}
                                    <br/>
                                    <Button
                                        onClick={this.handleConfirm}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        onClick={this.handleBackClick}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );

        }
        else if (this.state.status === 1) {
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
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div id="hubTableContainerstyle" style={{"width":"90%", "height":"70%"}}>
                                <ReactTabulator
                                    columns={table_columns}
                                    data={job_data}
                                    rowClick={this.tableRowClicked}
                                    className="jobClass"
                                />
                            </div>
                            {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
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
                                    Park the Car ...
                                </Typography>
                                Additional Note for Location:
                                <Box component="form" noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="note"
                                        label="note"
                                        name="note"
                                        autoComplete="note"
                                        onChange={(event) => this.handleTextField(event.target.value)}
                                        autoFocus
                                    />
                                    <br/>
                                    <br/>
                                    <Button
                                        onClick={this.handleParkConfirm}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        confirm
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );
        }
        else if (this.state.status === 2) { // drop key
            return(
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
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div id="hubTableContainerstyle" style={{"width":"90%", "height":"70%"}}>
                                <ReactTabulator
                                    columns={table_columns}
                                    data={job_data}
                                    rowClick={this.tableRowClicked}
                                    className="jobClass"
                                />
                            </div>
                            {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
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
                                    Drop Key Off at ...
                                </Typography>
                                <Box component="form" noValidate sx={{ mt: 1 }}>
                                    Address:
                                    <br/>
                                    {this.state.hub}
                                    <br/>
                                    <br/>
                                    Verification Code:
                                    <br/>
                                    {this.state.code}
                                    <br/>
                                    <Button
                                        onClick={this.handleKeyConfirm}
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Confirm
                                    </Button>
                                    {/*<Button*/}
                                    {/*    onClick={this.handleBackClick}*/}
                                    {/*    fullWidth*/}
                                    {/*    variant="contained"*/}
                                    {/*    sx={{ mt: 3, mb: 2 }}*/}
                                    {/*>*/}
                                    {/*    Back*/}
                                    {/*</Button>*/}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            );

        }

    }
}

