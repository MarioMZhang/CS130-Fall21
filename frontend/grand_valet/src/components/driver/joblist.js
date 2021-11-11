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

function SimpleButton(props) {
    const rowData = props.cell._cell.row.data;
    const cellValue = props.cell._cell.value || "Confirm";
    return <button onClick={() => alert(rowData.name)}>{cellValue}</button>;
}
const theme = createTheme();

var printIcon = function(cell, formatterParams, onRendered){ //plain text value
    return "<button>Confirm</button>";
};

const table_columns = [
    { title: "ID", field: "id"},
    { title: "Description", field: "Description"},
    { title: "Distance", field: "Distance" },
    { title: "Spots", field: "Spots"},
    { title: "Open Time", field:"Opentime" },
    { title: "Close Time", field:"Closetime" },
    {
        title: "Confirm",
        align: "center",
        formatter: printIcon,
        cellClick: function (e, cell) {
            if (window.confirm('Are you sure you wish to confirm this task? \n(please make sure you have gotten paid)')) {
                cell.getRow().delete();
            }
        }}

];

var table_data = [
    {id:1, Description:"South of UCLA", Distance: 3.5, Spots: 7, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:2, Description:"Westwood", Distance: 13.5, Spots: 1, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:3, Description:"Target", Distance: 1.2, Spots: 0, Opentime: 12512313, Closetime: 12333333, Available: false},
    {id:4, Description:"Hammer Museum", Distance: 5.9, Spots: 12, Opentime: 12512313, Closetime: 12333333, Available: true},
    {id:5, Description:"Wilshire", Distance: 4.6, Spots: 9, Opentime: 12512313, Closetime: 12333333, Available: false},
];
export default class Joblist extends React.Component{
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
                            // backgroundColor: (t) =>
                            //     t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div>
                            <button>Break</button>
                        </div>
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

