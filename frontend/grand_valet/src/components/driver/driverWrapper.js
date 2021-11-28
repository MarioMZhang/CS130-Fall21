import React from "react";
import Joblist from './joblist';
import DropoffIP from './dropoffIP';
import Driving from './driving';
import Complete from './complete';
import Break from './break';
import Offwork from './offwork';

export default function DriverWrapper() {
    let searchParam = window.location.search;
    let component = null;
    if (searchParam.includes("joblist")) {
        component = <Joblist/>;
    }
    else if (searchParam.includes("ip"))  {
        component = <DropoffIP/>;
    }
    else if (searchParam.includes("driving")) {
        component = <Driving/>;
    }
    else if (searchParam.includes("complete")) {
        component = <Complete/>;
    }
    else if (searchParam.includes("break")) {
        component = <Break/>;
    }
    else if (searchParam.includes("offwork")) {
        component = <Offwork/>;
    }
    return(
        <div>{component}</div>
    )



}
