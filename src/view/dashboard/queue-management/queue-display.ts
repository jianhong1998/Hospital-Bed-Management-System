interface NumberHolder {
    holder: HTMLElement,
    value: number
}

const calculateTotalPatientAdmission = async ():Promise<number> => {
    let totalPatientAdmission = 0;

    try {
        const fetchUrl = "http://localhost:8080/fetch/patient-queue/patient-admission-today";
        const response = await fetch(fetchUrl);
        const data = await response.json();
        
        totalPatientAdmission = data.totalPatientAdmission;
        
        return Promise.resolve(totalPatientAdmission);
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
}

const getAllNumbers = async ():Promise<Array<NumberHolder>> => {
    // Queue Numbers
    const totalPatientContainer:NumberHolder = {
        holder: <HTMLDivElement> document.getElementById("container-total-patient-in-queue"),
        value: 0
    };
    const generalWardQueueContainer:NumberHolder = {
        holder: <HTMLDivElement> document.getElementById("container-general-ward-queue"),
        value: 0
    };
    const intensiveCareQueueContainer:NumberHolder = {
        holder: <HTMLDivElement> document.getElementById("container-intensive-care-queue"),
        value: 0
    };
    const infectiousDiseaseQueueContainer:NumberHolder = {
        holder: <HTMLDivElement> document.getElementById("container-infectious-disease-queue"),
        value: 0
    };

    // Other Numbers
    const totalPatientInWard:NumberHolder = {
        holder: <HTMLSpanElement> document.getElementById("total-patient-in-ward"),
        value: 0
    };
    const totalWard:NumberHolder = {
        holder: <HTMLSpanElement> document.getElementById("total-ward"),
        value: 0
    };
    const totalPatientAdmission:NumberHolder = {
        holder: <HTMLDivElement> document.getElementById("container-total-patient-admission"),
        value: 0
    };

    // Get all numbers' value
    try {
        totalPatientContainer.value = calculatePatientInQueue();
        generalWardQueueContainer.value = queueArray[0].queue.length;
        intensiveCareQueueContainer.value = queueArray[1].queue.length;
        infectiousDiseaseQueueContainer.value = queueArray[2].queue.length;
        totalPatientInWard.value = await calculateOccupiedWard();
        totalWard.value = wardArray.length;
        totalPatientAdmission.value = await calculateTotalPatientAdmission();

    } catch (error) {
        if (Object.keys(error as {errorMessage:string}).includes("errorMessage")) {
            return Promise.reject((error as {errorMessage:string}).errorMessage);
        }

        if (Object.getPrototypeOf(error).name === "TypeError") {
            
            if ((error as TypeError).message.toLowerCase().includes("failed to fetch")) {
                return Promise.reject("Error: No response from backend server. Failed to execute assignWardService().");
            }
            
            return Promise.reject((error as TypeError).message);
        }

        return Promise.reject(error);
    }


    return Promise.resolve([totalPatientContainer, generalWardQueueContainer, intensiveCareQueueContainer, infectiousDiseaseQueueContainer, totalPatientInWard, totalWard, totalPatientAdmission]);
};

const displayAllNumbers = async (numberHolderArray: Array<NumberHolder>):Promise<void> => {
    for (let numberHolder of numberHolderArray) {
        const textNode = document.createTextNode(numberHolder.value.toString());
        
        numberHolder.holder.childNodes.forEach(
            (childNode) => {
                numberHolder.holder.removeChild(childNode);
            }
        );
        numberHolder.holder.appendChild(textNode);
    }
};