
import React from "react";
import './joblist.css';
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
import {HTTPHandler} from './../util/http';
const theme = createTheme();
const table_columns = [
    { title: "hubId", field: "hubId"},
    { title: "licenceState", field: "licenceState"},
    { title: "licenceNum", field: "licenceNum" },
    { title: "scheduledTime", field: "scheduledTime"}

];
export default class DropoffIP extends React.Component {

    updateHubs = () => {
        let handler = new HTTPHandler();
        handler.asyncGetHubs()
            .then(hubs => {
                var res = [];

                for (let i = 0; i < hubs.length; i ++) {
                    const cur = hubs[i];
                    var temp = {
                        id: cur.hubId,
                        Description: cur.description,
                        // Distance: getDistanceFromLatLonInKm(cur.location[1], cur.location[0], this.state.user_lat, this.state.user_lng),
                        Opentime: new Date(cur.startTime * 1000).toTimeString(),
                        Closetime: new Date(cur.endTime * 1000).toTimeString(),
                        latitude: cur.location[1],
                        longitude: cur.location[0]
                    };
                    res.push(temp);
                }

                this.setState({hub_data: res});
            });
    };

    updateJoblist = () => {
        let handler = new HTTPHandler();
        handler.asyncGetDriverJobs("driver1")
            .then(jobs => {
                var res = [];

                for (let i = 0; i < jobs.length; i ++) {
                    const cur = jobs[i];
                    var temp = {
                        type: cur.type,
                        id: cur.jobId,
                        scheduledTime: new Date(cur.scheduledTime * 1000).toTimeString().substring(0,8),
                        licenceState: cur.licenceState,
                        licenceNum: cur.licenceNum,
                        hubId: cur.hubId,
                        code: cur.code,
                        status: cur.status
                    };
                    res.push(temp);
                }
                // console.log(res);
                this.setState({job_data: res});

            });
    };

    componentDidMount() {
        console.log("mounting!");
        this.updateJoblist();
        this.updateHubs();

        // let timeLeftVar = this.secondsToTime(this.state.seconds);
        // this.setState({ time: timeLeftVar });
        if (this.state.inBreak || (this.state.scheduleBreak && this.state.job_data.length === 0)) {
            if (!this.state.inBreak) {
                this.setState({
                    inBreak: true
                });
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            id: -1,
            status: -1,
            code: -1,
            hubId: -1,
            carLocNote: "",
            scheduleBreak: false,
            breakLength: 0,
            tempBreakLength: 10,
            inBreak: false,
            time: {},
            seconds: 0,
            job_data: [],
            hub_data: []
        };
    }
    handleDropOff = () => {
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
                        <div id="hubTableContainerstyle" style={{"width":"100%", "height":"80%"}}>
                            <ReactTabulator
                                columns={table_columns}
                                data={this.state.job_data}
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
                            <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
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


    render(){
        console.log("current status")
        console.log(this.state.job_data);
        console.log(this.state.hub_data);
        // console.log(this.props);
        console.log(this.state.status);
        console.log(this.state.tempBreakLength);
        console.log("inBreak? "+this.state.inBreak);
        if (this.state.inBreak) {
            return this.handleInBreak();
        }
        else {return this.handleDropOff();}


    }
}