// import wardFunction from "./ward-function";
// import wardDisplay1 from "./ward-display";
// import { WardStatus } from "./ward-enum";

const verifyWardStatusAndPatientId = (wardStatus:WardStatus, patientId:(number | undefined | null)):boolean => {
    if (wardStatus > 1 && wardStatus <= 4) {
        return true;
    }

    return wardStatus === 1 && patientId !== undefined && patientId !== null;
};

const dischargeWard = (wardId: number):void => {
    const wardIndex = getWardIndexInArray(wardId);

    if (wardArray[wardIndex].currentStatus.toString().toLowerCase() === "available") {
        return;
    }
    
    let seconds: number = 0;
    let minutes: number = 0;
    
    try {
        changeWardStatus(wardId, WardStatus.DISCHARGED_PENDING_SANITIZING, null);
        refreshWardData(wardId);

        seconds += 5;
        // minutes += 1;

        setTimeout(
            () => {
                changeWardStatus(wardId, WardStatus.SANITIZING, null);
                refreshWardData(wardId);
            },
            (minutes * 60 + seconds) * 1000
        );

        seconds += 5;
        // minutes += 2;

        setTimeout(
            () => {
                changeWardStatus(wardId, WardStatus.AVAILABLE, null);
                refreshWardData(wardId);
                assignWardService();
            },
            (minutes * 60 + seconds) * 1000
        );
    } catch (error) {
        alert(error);
    }
};

// export default {
//     verifyWardStatusAndPatientId,
//     dischargeWard
// };