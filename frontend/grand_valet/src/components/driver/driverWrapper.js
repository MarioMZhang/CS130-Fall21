import React from "react";
import Joblist from './joblist';
import DropoffIP from './dropoffIP';
import Driving from './driving';
import Complete from './complete';

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
    return(
        <div>{component}</div>
    )



}
