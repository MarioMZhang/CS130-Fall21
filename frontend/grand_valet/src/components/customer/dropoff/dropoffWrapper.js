import React from "react";
import DropoffSchedule from './dropoffSchedule';
import DropoffIP from './dropoffIP';
import DropoffComplete from './dropoffComplete';

export default function CustomerDropoffWrapper() {
    let searchParam = window.location.search;
    let component = null;
    if (searchParam.includes("schedule")) {
        component = <DropoffSchedule/>;
    } else if (searchParam.includes("ip")) {
        component = <DropoffIP/>;
    } else if (searchParam.includes("complete"))
        component = <DropoffComplete/>;
    return(
        <div>{component}</div>
    )



}
