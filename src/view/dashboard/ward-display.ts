import {Ward , WardType, WardStatus} from "../../utilities/model/ward-interface";

// const wardContainer = <HTMLDivElement>document.getElementById("ward-container");

const wardArray:Array<Ward> = [];

let newWard:Ward = {
    wardId: 1,
    wardType: WardType.GENERAL_WARD,
    currentStatus: WardStatus.AVAILABLE,
    patientId: null
};

wardArray.push(newWard);

console.log(wardArray);