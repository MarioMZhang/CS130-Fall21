import React from "react";
import Joblist from './joblist';
import DropoffIP from './dropoffIP';

export default function DriverWrapper() {
    let searchParam = window.location.search;
    let component = null;
    if (searchParam.includes("joblist")) {
        component = <Joblist/>;
    }
    else if (searchParam.includes("ip"))  {
        component = <DropoffIP/>;
    }
    return(
        <div>{component}</div>
    )



}
