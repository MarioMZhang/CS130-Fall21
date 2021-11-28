import React from "react";
import './joblist.css';
import ReactDOM from 'react-dom';
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

//
// function Countdown({ seconds }) {
//     const [timeLeft, setTimeLeft] = useState(seconds);
//     const intervalRef = useRef(); // Add a ref to store the interval id
//
//     useEffect(() => {
//         intervalRef.current = setInterval(() => {
//             setTimeLeft((t) => t - 1);
//         }, 1000);
//         return () => clearInterval(intervalRef.current);
//     }, []);
//
//     // Add a listener to `timeLeft`
//     useEffect(() => {
//         if (timeLeft <= 0) {
//             clearInterval(intervalRef.current);
//         }
//     }, [timeLeft]);
//
//     return <div>{timeLeft}s</div>;
// }

// export default class Offwork extends React.Component

export default class Offwork extends React.Component  {


    constructor() {

        super();

        this.state = { time: {}, seconds: 1200};
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.end_time = parseInt((new URL(window.location.href)).searchParams.get("len"));

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

    componentDidMount() {
        // var t = new Date();
        // Math.floor(t/1000)

        let timeLeftVar = this.secondsToTime(this.state.seconds);
        // this.setState({ time: timeLeftVar, end_time: t});

    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            clearInterval(this.timer);
        }
    }

    render() {
        if (this.state.seconds === 0) {

        }
        else {
            return(
                <div>
                    Your break session ends at:
                    {Math.floor(this.end_time/1000).toString()}
                    {this.startTimer()}
                    {/*m: {this.state.time.m} s: {this.state.time.s}*/}
                </div>
            );
        }

    }
}

ReactDOM.render(<Offwork/>, document.getElementById('root'));
