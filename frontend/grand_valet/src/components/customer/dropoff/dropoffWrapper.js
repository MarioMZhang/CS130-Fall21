import React from "react";
import DropoffSchedule from './dropoffSchedule';
import DropoffIP from './dropoffIP';
import DropoffComplete from './dropoffComplete';
import PickupIP from './pickupIP';
import PickKey from './pickKey';
import TakeCar from './takeCar';

export default function CustomerDropoffWrapper() {
    let searchParam = window.location.search;
    let component = null;
    if (searchParam.includes("schedule")) {
        component = <DropoffSchedule/>;
    } else if (searchParam.includes("ip")) {
        component = <DropoffIP/>;
    } else if (searchParam.includes("complete")) {
        component = <DropoffComplete/>;
    }
    else if (searchParam.includes("pickup")) {
        component = <PickupIP/>;
    }
    else if (searchParam.includes("key")) {
        component = <PickKey/>;
    }
    else if (searchParam.includes("car")) {
        component = <TakeCar/>;
    }
    return(
        <div>{component}</div>
    )



}
