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




var fake_job = {
        "type": 3,
        "jobId": 0,
        "scheduledTime": null,
        "status": 11,
        "licenceState": "break",
        "licenceNum": "break",
        "hubId": "break",
        "code": 132561,
        "carLocation": null,
        "note": null,
        "driverUsername": "driver1",
        "customerUsername": null,
        "advanceState": [0, 0]
    }

const theme = createTheme();

var printIcon = function(cell, formatterParams, onRendered){ //plain text value
    return "<button>Confirm</button>";
};

const table_columns = [
    { title: "jobId", field:  "id"},
    { title: "hubId", field: "hubId"},
    { title: "licenceState", field: "licenceState"},
    { title: "licenceNum", field: "licenceNum" },
    { title: "scheduledTime", field: "scheduledTime"}

];


export default class Joblist extends React.Component{

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

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
    
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
    
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
    
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
    }

    updateHubs = () => {
        let handler = new HTTPHandler();
        handler.asyncGetHubs()
            .then(hubs => {
                var res = [];
                console.log("update hubs: "+hubs.length);
                for (let i = 0; i < hubs.length; i ++) {
                    const cur = hubs[i];
                    var temp = {
                        id: cur.hubId,
                        Description: cur.description,
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
                console.log("updateJobList----")
                console.log(jobs);
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
                        status: cur.status,
                        note: cur.note
                    };
                    res.push(temp);
                }
                console.log(jobs);
                res.sort((a,b)=>(a.scheduledTime>b.scheduledTime)?1:-1);
                this.setState({job_data: res});
            });
    };


    componentDidMount() {
        console.log("mounting!");
        this.updateJoblist();
        this.updateHubs();

        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
        if (this.state.inBreak || (this.state.scheduleBreak && this.state.job_data.length === 0)) {
            if (!this.state.inBreak) {
                this.setState({
                    inBreak: true
                });
            }
        }
    }

    handleInBreak = (id) => {
        window.location.href = "/driver?stage=offWork&id="+id;
        let handler = new HTTPHandler();
        handler.asyncGetJobsFromID(id)
            .then(job => {
                // window.alert(job.id);
                if (!job) {
                    window.alert("job not found!");
                }
                else {
                    job.status = 12;
                    return job;
                }
            })
            .then (updated =>{
                handler.asyncPostJob(updated)
                    .then(response => {
                        console.log("post job:");
                        console.log(response);
                        window.location.href = "/driver?stage=offWork&id="+response.jobId;
                        return response;
                    });
            });
    }

    handleDropdown = (e) => {
        this.setState({
            tempBreakLength: e.target.value,
        });
        console.log("tempBreakLength: "+e.target.value);
    }

    handleBreak = (e) => {
        console.log("schedule a break");
        var data = new Date();
        let handler = new HTTPHandler();
        fake_job.note = this.state.tempBreakLength;
        // var scheduled_time = new Date();

        handler.asyncGetDriverJobs("driver1")
            .then(jobs => {
                console.log("updateJobList----")
                console.log(jobs);
                var res = [];

                for (let i = 0; i < jobs.length; i ++) {
                    const cur = jobs[i];
                    res.push(cur);
                }

                res.sort((a,b)=>(a.scheduledTime>b.scheduledTime)?1:-1);

                fake_job.scheduledTime = (res[res.length - 1].scheduledTime > Math.floor(data/1000)) ? (res[res.length - 1].scheduledTime + 1200).toString() : (Math.floor(data/1000)+600).toString()// the time a break is ok
                return fake_job;
            })
            .then(fake_job=>{
                console.log(fake_job);
                handler.asyncPostJob(fake_job)
                    .then(response => {
                        console.log("post job: \n"+response);
                        console.log("advanceState "+ response.advanceState);
                        window.location.href = "/driver?stage=joblist";
                    });
            });
        // data.setHours(data.getHours()+18*60);
        // console.log(Math.floor(data/1000));
        // console.log(data);
        // scheduled_time.setMinutes(parseInt((data.getMinutes).toString()));
        // fake_job.scheduledTime = Math.floor((data/1000)+1000).toString();


        // this.updateJoblist();
        // this.setState({
        //     scheduleBreak: true,
        //     seconds: this.state.tempBreakLength * 60,
        //     breakLength: this.state.tempBreakLength
        // });
    }

    handleTextField = (v) => {
        this.setState({
            carLocNote: v
        });
    }
    handleBackClick = () => {
        console.log("handle back click");
        this.setState({
            type:0,
            id: -1,
            status: -1,
            code: -1,
            hubId: -1
        });
    }
    handleParkConfirm = () => {
        console.log("save notes for car location");
        for (var i = 0; i < this.state.job_data.length; i++) {
            if (this.state.job_data[i].id === this.state.id) {
                this.state.job_data[i].carLocation = this.state.carLocNote;
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
        for (var i = 0; i < this.state.job_data.length; i++) {
            if (this.state.job_data[i].id === this.state.id) {
                this.state.job_data[i].status = this.state.status + 1; // job is done TODO: change to API
                this.state.job_data[i].driverUsername = "Guy";
                this.state.job_data.splice(i, 1);
            }
        }
        this.setState({
            type: 0,
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
            .then(final_job=> {
                for (var i = 0; i < this.state.hub_data.length; i++) {
                    if (this.state.hub_data[i].id === hub) {
                        dpt = this.state.hub_data[i].Description
                    }
                }
                if (data.status === 2 || data.status === 7) {
                    window.location.href = "/driver?stage=ip&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + job_info.note + "&type=" + data.type;
                }
                else if (data.status === 3 || data.status ===8) {
                    window.location.href = "/driver?stage=driving&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + data.note + "&type=" + data.type;
                }
                else if (data.status === 4 || data.status ===9) {
                    window.location.href = "/driver?stage=complete&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + data.note + "&type=" + data.type;
                }
                else { // break

                    window.location.href = "/driver?stage=break&id=" + data.id + "&code=" + data.code + "&hubId=" + data.hubId + "&dpt=" + dpt + "&status=" + data.status + "&loc=" + job_info.note + "&type=" + data.type;
                }
            });
    };

    handleDropOff = () => {
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
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div data-testid="test-table" id="hubTableContainerstyle" style={{"width":"100%", "height":"80%"}}>
                                <ReactTabulator
                                    columns={table_columns}
                                    data={this.state.job_data}
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
                                <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
                                    <br/>
                                    <p>Schedule Your Break ...</p>

                                    <FormControl sx={{ m:1, midWidth: 180 }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Minute</InputLabel>
                                        <Select
                                            autoWidth
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.tempBreakLength}
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
        // ------ FOR PICK UP TASK ------
        // else if (this.state.status === 0 && this.state.type === 2) {
        //     return(
        //         <ThemeProvider theme={theme}>
        //             <Grid container component="main" sx={{ height: '100vh' }}>
        //                 <CssBaseline />
        //                 <Grid
        //                     item
        //                     xs={false}
        //                     sm={4}
        //                     md={7}
        //                     sx={{
        //                         backgroundRepeat: 'no-repeat',
        //                         backgroundSize: 'cover',
        //                         backgroundPosition: 'center',
        //                     }}
        //                 >
        //                     <div id="hubTableContainerstyle" style={{"width":"100%", "height":"80%"}}>
        //                         <ReactTabulator
        //                             columns={table_columns}
        //                             data={this.state.job_data}
        //                             rowClick={this.tableRowClicked}
        //                             className="jobClass"
        //                         />
        //                     </div>
        //                     {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
        //                 </Grid>
        //                 <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        //                     <Box
        //                         sx={{
        //                             my: 8,
        //                             mx: 4,
        //                             display: 'flex',
        //                             flexDirection: 'column',
        //                             alignItems: 'center',
        //                         }}
        //                     >
        //                         <Typography component="h1" variant="h5">
        //                             Pick Key Up at ...
        //                         </Typography>
        //                         <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
        //                             Address:
        //                             <br/>
        //                             {this.state.hub}
        //                             <br/>
        //                             <br/>
        //                             Verification Code:
        //                             <br/>
        //                             {this.state.code}
        //                             <br/>
        //                             <Button
        //                                 onClick={this.handleConfirm}
        //                                 fullWidth
        //                                 variant="contained"
        //                                 sx={{ mt: 3, mb: 2 }}
        //                             >
        //                                 Confirm
        //                             </Button>
        //                             <Button
        //                                 onClick={this.handleBackClick}
        //                                 fullWidth
        //                                 variant="contained"
        //                                 sx={{ mt: 3, mb: 2 }}
        //                             >
        //                                 Back
        //                             </Button>
        //                         </Box>
        //                     </Box>
        //                 </Grid>
        //             </Grid>
        //         </ThemeProvider>
        //     );
        //
        // }
        // else if (this.state.status === 1 && this.state.type === 2) {
        //     return (
        //         <ThemeProvider theme={theme}>
        //             <Grid container component="main" sx={{ height: '100vh' }}>
        //                 <CssBaseline />
        //                 <Grid
        //                     item
        //                     xs={false}
        //                     sm={4}
        //                     md={7}
        //                     sx={{
        //                         backgroundRepeat: 'no-repeat',
        //                         backgroundSize: 'cover',
        //                         backgroundPosition: 'center',
        //                     }}
        //                 >
        //                     <div id="hubTableContainerstyle" style={{"width":"100%", "height":"80%"}}>
        //                         <ReactTabulator
        //                             columns={table_columns}
        //                             data={this.state.job_data}
        //                             rowClick={this.tableRowClicked}
        //                             className="jobClass"
        //                         />
        //                     </div>
        //                     {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
        //                 </Grid>
        //                 <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        //                     <Box
        //                         sx={{
        //                             my: 8,
        //                             mx: 4,
        //                             display: 'flex',
        //                             flexDirection: 'column',
        //                             alignItems: 'center',
        //                         }}
        //                     >
        //                         <Typography component="h1" variant="h5">
        //                             Take the Car Out from...
        //                         </Typography>
        //                         Note for Location:
        //                         <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
        //                             <TextField
        //                                 margin="normal"
        //                                 required
        //                                 fullWidth
        //                                 id="note"
        //                                 label="note"
        //                                 name="note"
        //                                 autoComplete="note"
        //                                 value={this.state.carLocNote}
        //                                 onChange={(event) => this.handleTextField(event.target.value)}
        //                                 autoFocus
        //                                 disabled
        //                             />
        //                             {/*<p>{this.state.carLocNote}</p>*/}
        //                             <br/>
        //                             <br/>
        //                             <Button
        //                                 onClick={this.handleParkConfirm}
        //                                 fullWidth
        //                                 variant="contained"
        //                                 sx={{ mt: 3, mb: 2 }}
        //                             >
        //                                 confirm
        //                             </Button>
        //                         </Box>
        //                     </Box>
        //                 </Grid>
        //             </Grid>
        //         </ThemeProvider>
        //     );
        // }
        // else if (this.state.status === 2 && this.state.type === 2) { // drop key
        //     return(
        //         <ThemeProvider theme={theme}>
        //             <Grid container component="main" sx={{ height: '100vh' }}>
        //                 <CssBaseline />
        //                 <Grid
        //                     item
        //                     xs={false}
        //                     sm={4}
        //                     md={7}
        //                     sx={{
        //                         backgroundRepeat: 'no-repeat',
        //                         backgroundSize: 'cover',
        //                         backgroundPosition: 'center',
        //                     }}
        //                 >
        //                     <div id="hubTableContainerstyle" style={{"width":"100%", "height":"80%"}}>
        //                         <ReactTabulator
        //                             columns={table_columns}
        //                             data={this.state.job_data}
        //                             rowClick={this.tableRowClicked}
        //                             className="jobClass"
        //                         />
        //                     </div>
        //                     {this.state.scheduleBreak && <p>You have schedule a break for {this.state.breakLength} minutes after you finish all existing jobs.</p>}
        //                 </Grid>
        //                 <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        //                     <Box
        //                         sx={{
        //                             my: 8,
        //                             mx: 4,
        //                             display: 'flex',
        //                             flexDirection: 'column',
        //                             alignItems: 'center',
        //                         }}
        //                     >
        //                         <Typography component="h1" variant="h5">
        //                             Drop Car Off at ...
        //                         </Typography>
        //                         <Box data-testid="test-button" component="form" noValidate sx={{ mt: 1 }}>
        //                             Address:
        //                             <br/>
        //                             {this.state.hub}
        //                             <br/>
        //                             <br/>
        //                             Verification Code:
        //                             <br/>
        //                             {this.state.code}
        //                             <br/>
        //                             <Button
        //                                 onClick={this.handleKeyConfirm}
        //                                 fullWidth
        //                                 variant="contained"
        //                                 sx={{ mt: 3, mb: 2 }}
        //                             >
        //                                 Confirm
        //                             </Button>
        //                         </Box>
        //                     </Box>
        //                 </Grid>
        //             </Grid>
        //         </ThemeProvider>
        //     );
        // }
    }

    render(){
        console.log("current status")
        console.log(this.state);

        const [first] = this.state.job_data;
        console.log(first);
        if (this.state.job_data.length != 0 && first.type === 3 && first.status != 13) {
            var time = new Date();
            const len = Math.floor(time / 1000) + first.note * 60;
            window.location.href = "/driver?stage=offwork&id=" + first.id.toString() + "&len=" + len.toString();
        }
        else {return this.handleDropOff();}
    }
}

