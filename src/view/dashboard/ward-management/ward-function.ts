// import wardDisplay from './ward-display';
// import wardDischarge from './ward-discharge';
// import Ward from './ward-interface';
// import { WardStatus, WardType } from './ward-enum';


const fetchAllWardsData = async ():Promise<Ward[]> => {
    const wardArray:Array<Ward> = [];
    
    try {
        const response = await fetch("http://localhost:8080/fetch/ward/all-ward");
        const data = await response.json();

        if (data.length === 0) {
            return Promise.reject({errorMessage: "No ward data is available"});
        }

        for (let i = 0 ; i < data.length; i++) {
            wardArray.push({
                wardId: data[i].ward_id,
                wardType: data[i].ward_type,
                currentStatus: data[i].current_status,
                patientId: data[i].patient_id
            });
        }
    } catch (error) {
        const errorMessage = ((error as unknown) as Error).message;
        return Promise.reject({errorMessage});
    }

    return Promise.resolve(wardArray);
};

const getWardIndexInArray = (wardId:number):number => {
    let index:number = -1;

    for (let i = 0 ; i < wardArray.length ; i++) {
        if (wardArray[i].wardId === wardId) {
            index = i;
            break;
        }
    }

    return index;
}

const fetchWardData = async (wardId:number):Promise<Ward> => {
    interface dataSetFromDatabase {
        ward_id: number,
        ward_type: WardType,
        current_status: WardStatus,
        patient_id: number
    };
    
    const ward:Ward = {
        wardId: -1,
        wardType: WardType.GENERAL_WARD,
        currentStatus: WardStatus.AVAILABLE,
        patientId: null
    };
    
    try {
        const url = `http://localhost:8080/fetch/ward/ward/?wardId=${wardId}`;
        const response = await fetch(url);

        const responseDataArray:dataSetFromDatabase[] = await response.json();

        if (responseDataArray.length === 0) {
            return Promise.reject({errorMessage: "Ward is not found"});
        }

        const responseData = responseDataArray[0];

        ward.wardId = responseData.ward_id;
        ward.wardType = responseData.ward_type;
        ward.currentStatus = responseData.current_status;
        ward.patientId = responseData.patient_id;
    } catch (error) {
        const errorMessage = ((error as unknown) as Error).message;
        return Promise.reject({errorMessage});
    }

    return Promise.resolve(ward);
}

const changeWardStatus = async (wardId:number, wardStatus:WardStatus, patientId:(number|null|undefined)):Promise<any> => {
    if (!verifyWardStatusAndPatientId(wardStatus, patientId)) {
        return Promise.reject({errorMessage: "patientId must not be NULL or UNDEFINED when setting wardStatus to 1 (occupied)"});
    }

    const fetchUrl = 'http://localhost:8080/fetch/ward/set-ward-status';
    
    const requestBody = {
        wardId,
        wardStatus,
        patientId
    };

    const requestHeader = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    const response = await fetch(fetchUrl, {
        method: "POST",
        headers: requestHeader,
        body: JSON.stringify(requestBody)
    });

    return Promise.resolve(await response.json());
};

const calculateOccupiedWard = async ():Promise<number> => {
    try {
        const fetchUrl = "http://localhost:8080/fetch/ward/total-occupied-ward";
        const response = await fetch(fetchUrl);
        const data = await response.json();
        return data.totalOccupiedWard;
    } catch (error) {
        if (Object.keys(error as {errorMessage:string}).includes("errorMessage")) {
            return Promise.reject((error as {errorMessage:string}));
        }

        if (Object.getPrototypeOf(error).name === "TypeError") {
            
            if ((error as TypeError).message.toLowerCase().includes("failed to fetch")) {
                return Promise.reject({errorMessage: "Error: No response from backend server. Failed to execute assignWardService()."});
            }
            
            return Promise.reject({errorMessage: (error as TypeError).message});
        }

        return Promise.reject({errorMessage: error});
    }
};

// export default {
//     fetchAllWardsData,
//     getWardIndexInArray,
//     fetchWardData,
//     changeWardStatus
// }