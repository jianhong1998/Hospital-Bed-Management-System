// import wardDisplay from "./ward-display";
// import wardFunction from "./ward";
// import { WardStatus } from "./ward-enum";

const occupyWard = async (wardId:number, patientId:number):Promise<boolean> => {
    try {
        const wardIndex = getWardIndexInArray(wardId);

        const ward = await fetchWardData(wardId);

        if (ward.currentStatus.toString().toLowerCase() !== "available") {
            alert(`Ward ${wardId} is not available now`);
            return false;
        }
        
        const response = changeWardStatus(wardId, WardStatus.OCCUPIED, patientId);
        response.then(
            (value) => {
                refreshWardData(wardId);
            }
        );
    } catch (error) {
        if (Object.keys(error as {errorMessage: string}).includes("errorMessage")) {
            if ((error as {errorMessage: string}).errorMessage.toLowerCase().includes("failed to fetch")) {
                alert("Server is no response, please try again after 3 seconds.");
                return false;
            }
            
            alert((error as {errorMessage:string}).errorMessage);
            return false;
        }
        
        alert(error);
        return false;
    }
    
    return true;
};

const checkAnyWardAvailable = (patientCategory:Category):Array<number> => {
    const availableWardArray:Array<number> = [];

    let searchWardType:string = "";

    switch (patientCategory.valueOf()) {
        case 3:
            searchWardType = "General Ward";
            break;
        case 1:
            searchWardType = "Intensive Care Ward";
            break;
        case 2:
            searchWardType = "Infectious Disease Ward";
            break;
        default:
            break;
    }

    // If wardType is invalid
    // Return empty array
    if (searchWardType.length === 0) {
        return [];
    }
    
    for (let i = 0; i < wardArray.length ; i++) {
        if (wardArray[i].wardType.toString() === searchWardType && wardArray[i].currentStatus.toString().toLowerCase() === "available") {
            availableWardArray.push(wardArray[i].wardId);
        }
    }

    return availableWardArray;
}

const assignWardService = async ():Promise<void> => {
    try {
        await getAllQueueData();
    
        if (calculatePatientInQueue() === 0) {
            return;
        }

        for (let patientQueue of queueArray) {
            let availableWardArray:Array<number> = [];
            
            let searchPatientCategory:Category = 0;

            switch (patientQueue.patientCategory.toLowerCase()) {
                case "general care":
                    searchPatientCategory = 3;
                    break;
                case "intensive care":
                    searchPatientCategory = 1;
                    break;
                case "infectious disease":
                    searchPatientCategory = 2;
                    break;
                default:
                    break;
            }

            availableWardArray = checkAnyWardAvailable(searchPatientCategory);

            while (availableWardArray.length > 0 && patientQueue.queue.length > 0) {
                const wardId = <number>availableWardArray.shift();

                const patientId = <number>patientQueue.queue.shift();

                occupyWard(wardId, patientId)
                .then(
                    async value => {
                        if (value) {
                            await dequeuePatient(patientId);
                        }

                        availableWardArray = checkAnyWardAvailable(searchPatientCategory);
                        getAllQueueData();
                        console.log(`Assign Patient ${patientId} to Ward ${wardId}`);
                    }
                );
            }
        }
    } catch (error) {
        if (Object.keys(error as {errorMessage:string}).includes("errorMessage")) {
            console.log((error as {errorMessage:string}).errorMessage);
            return;
        }

        if (Object.getPrototypeOf(error).name === "TypeError") {
            
            if ((error as TypeError).message.toLowerCase().includes("failed to fetch")) {
                console.log("Error: No response from backend server. Failed to execute assignWardService().");
                return;
            }
            
            console.log((error as TypeError).message);
            return;
        }

        console.log(error);
    }
    
}

// export default {
//     occupyWard
// };