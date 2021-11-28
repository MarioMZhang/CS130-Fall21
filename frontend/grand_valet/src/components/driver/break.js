
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
    { title: "jobId", field:  "id"},
    { title: "hubId", field: "hubId"},
    { title: "licenceState", field: "licenceState"},
    { title: "licenceNum", field: "licenceNum" },
    { title: "scheduledTime", field: "scheduledTime"}

];
export default class Break extends React.Component {

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
                console.log("updateJobList---");
                console.log(jobs);
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
                        status: cur.status,
                        note: cur.note
                    };
                    res.push(temp);
                }
                res.sort((a,b)=>(a.scheduledTime>b.scheduledTime)?1:-1);
                this.setState({job_data: res});

            });
    };
    updateJob = () => {
        var cur = null;
        let handler = new HTTPHandler();
        handler.asyncGetJobsFromID(parseInt((new URL(window.location.href)).searchParams.get("id")))
            .then(job => {

                var temp = {
                    type: job.type,
                    id: job.jobId,
                    code: job.code,
                    scheduledTime: new Date(job.scheduledTime * 1000).toTimeString().substring(0,8),
                    licenceState: job.licenceState,
                    licenceNum: job.licenceNum,
                    hubId: job.hubId,
                    code: job.code,
                    status: job.status
                };
                this.setState({cur_job: job, status: job.status});
            });
    };

    handleKeyConfirm = () => {
        console.log("handle key confirm");
        let handler = new HTTPHandler();
        handler.asyncGetJobsFromID(this.state.id)
            .then(job => {

                if (!job) {
                    window.alert("job not found!");
                }
                else {
                    if (job.status === 4) {
                        // job.note = "4";
                        job.status = 5;
                    }
                    else {
                        // job.note = "9";
                        job.status = 9;
                        job.advanceState[1] = 1;
                    }
                    job.driverUsername = null;
                    // job.carLocation = this.state.carLocNote;
                    return job;
                }
            })
            .then(updated => {
                handler.asyncPostJob(updated)
                    .then(response => {
                        console.log("post job: \n"+response);
                    });
                window.location.href = "/driver?stage=joblist";
            })

            .catch(err => console.log(err.toString()));
    }

    componentDidMount() {
        console.log("mounting!");
        this.updateJoblist();
        this.updateHubs();
        this.updateJob();
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
    tableRowClicked = (e, row) => {
        console.log("table row clicked");
        console.log("row id:" + row._row.data.id);
        // console.log(data.status);
        var data = row._row.data;
        var hub = data.hubId
        var dpt = null;
        var job_info = null;

        let handler = new HTTPHandler();
        handler.asyncGetJobsFromID(data.id)
            .then(job => {
                console.log(job);
                job_info = job;
            })
            .then(final_job => {
                for (var i = 0; i < this.state.hub_data.length; i++) {
                    if (this.state.hub_data[i].id === hub) {
                        dpt = this.state.hub_data[i].Description
                    }
                }
                if (data.status === 2 || data.status === 7) {
                    window.location.href = "/driver?stage=ip&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + job_info.note + "&type=" + data.type;
                } else if (data.status === 3 || data.status === 8) {
                    window.location.href = "/driver?stage=driving&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + data.note + "&type=" + data.type;
                } else if (data.status === 4 || data.status === 9) {
                    window.location.href = "/driver?stage=complete&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + data.note + "&type=" + data.type;
                } else { // break

                    window.location.href = "/driver?stage=break&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + job_info.note + "&type=" + data.type;
                }
            });
    };

    constructor(props) {
        super(props);

        this.state = {
            cur_job: null,
            type: parseInt((new URL(window.location.href)).searchParams.get("type")),
            id: parseInt((new URL(window.location.href)).searchParams.get("id")),
            status: parseInt((new URL(window.location.href)).searchParams.get("status")),
            code: parseInt((new URL(window.location.href)).searchParams.get("code")),
            hubId: parseInt((new URL(window.location.href)).searchParams.get("hubId")),
            hub: (new URL(window.location.href)).searchParams.get("dpt").toString(),
            carLocNote: ((new URL(window.location.href)).searchParams.get("loc")?(new URL(window.location.href)).searchParams.get("loc").toString():null),
            scheduleBreak: false,
            breakLength: 0,
            tempBreakLength: 10,
            inBreak: false,
            time: {},
            seconds: 0,
            job_data: [],
            hub_data: [],
            cur_time: (new Date()).toTimeString()
        };
        this.updateJob();
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
                        {this.state.scheduleBreak && <p>You have scheduled a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
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
                                <p>You have scheduled a break for {this.state.carLocNote} minutes after you finish all existing jobs.</p>
                                <br/>
                                <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
                                    Current Time:
                                    <br/>
                                    {this.state.cur_time}
                                </Box>
                            </Typography>


                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }


    render(){
        console.log("current status")
        console.log(this.state);
        console.log("inBreak? "+this.state.inBreak);
        if (this.state.job_data.length != 0 && this.state.job_data[0].type === 3) {
            return this.handleInBreak();
        }
        else {return this.handleDropOff();}


    }
}