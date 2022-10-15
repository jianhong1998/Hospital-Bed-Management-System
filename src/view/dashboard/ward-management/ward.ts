interface Ward {
    wardId: number;
    wardType: WardType;
    currentStatus: WardStatus;
    patientId: (number | null);
};

enum WardType {
    INTENSIVE_CARE_WARD = 3,
    INFECTIOUS_DISEASE_WARD = 2,
    GENERAL_WARD = 1
};

enum WardStatus {
    OCCUPIED = 1,
    DISCHARGED_PENDING_SANITIZING = 2,
    SANITIZING = 3,
    AVAILABLE = 4
};

const fetchAllWardsData = async ():Promise<Ward[]> => {
    const wardArray:Array<Ward> = [];
    
    try {
        const response = await fetch("http://localhost:8080/fetch/ward/all-ward");
        const data = await response.json();

        if (data.length === 0) {
            return Promise.reject("No ward data is available");
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
        return Promise.reject(<string>error);
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
            return Promise.reject("Ward is not found");
        }

        const responseData = responseDataArray[0];

        ward.wardId = responseData.ward_id;
        ward.wardType = responseData.ward_type;
        ward.currentStatus = responseData.current_status;
        ward.patientId = responseData.patient_id;
    } catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve(ward);
}

const changeWardStatus = async (wardId:number, wardStatus:WardStatus, patientId:(number|null|undefined)):Promise<any> => {
    if (!verifyWardStatusAndPatientId(wardStatus, patientId)) {
        return Promise.reject("patientId must not be NULL or UNDEFINED while wardStatus is 1 (occupied)");
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

    return Promise.resolve(response.json());
};