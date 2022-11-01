const seperateQueueDataToRespectiveQueueArray = (queueData:Array<{patientId:number, patientCategory:string}>):void => {
    for (let i = 0; i < queueData.length; i++) {
        switch (queueData[i].patientCategory) {
            case "General Care":
                generalCarePatientQueue.queue.push(queueData[i].patientId);
                break;
            case "Intensive Care":
                intensiveCarePatientQueue.queue.push(queueData[i].patientId);
                break;
            case "Infectious Disease":
                infectiousDiseasePatientQueue.queue.push(queueData[i].patientId);
                break;
            default:
                break;
        }
    }
};

const clearAllQueueArray = ():void => {
    for (let queue of queueArray) {
        queue.queue = [];
    }
};

const getAllQueueData = async ():Promise<void> => {
    try {
        const url = "http://localhost:8080/fetch/patient-queue/all-queue";

        const responseJson = await fetch(url);
        const response = await responseJson.json();

        clearAllQueueArray();
        seperateQueueDataToRespectiveQueueArray(response);
    } catch (error) {
        if (Object.getPrototypeOf(error).name === "TypeError") {
            console.log("Error: No response from backend server. Failed to execute getAllQueueData().");
            return;
        }

        console.log(error);
        return;
    }
    
};

const addPatientToQueue = async (patientId: number, patientCategory: Category):Promise<boolean> => {
    const url = "http://localhost:8080/fetch/patient-queue/new-queue";
    const body = JSON.stringify({patientId, patientCategory});
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    try {
        const responseJson = await fetch(url, {
            method: "POST",
            headers,
            body
        });
    
        const response = await responseJson.json();
    
        if (Object.keys(response)[0] === "errorMessage") {
            if (Object.getPrototypeOf(response.errorMessage).toString().includes("object Object")) {
                alert("Process failed.\nPatient is not added to any queue due to server isssue.\nPlease refresh the page.");
                return false;
            }
            
            alert(response.errorMessage);
            return false;
        }
    
        clearAllQueueArray();
        seperateQueueDataToRespectiveQueueArray(response);
        return true;
    } catch (error) {
        const errorMessage = ((error as unknown) as Error).message + "\nPlease refresh the page and try again.";
        return Promise.reject({errorMessage});
    }
};

// Dequeue patient in database and queueArray
const dequeuePatient = async (patientId:number):Promise<boolean> => {
    const url = "http://localhost:8080/fetch/patient-queue/dequeue";
    const headers = {
        "Accept": "applicaiton/json",
        "Content-Type": "application/json"
    };
    const body = JSON.stringify({patientId});

    let stopProcess:boolean = false;
    let isPatientInQueue:boolean = true;

    try {
        const responseJson = await fetch (url, {
            method: "POST",
            headers,
            body
        });

        const responseObj = await responseJson.json();

        if (Object.keys(responseObj)[0] === "errorMessage") {
            if (responseObj.errorMessage.toLowerCase().includes("not in queue")) {
                isPatientInQueue = false;
            }
            
            alert(responseObj.errorMessage);
            stopProcess = true;
            return Promise.reject();
        }


    } catch (error) {
        alert((error as unknown) as string);
        stopProcess = true;
    } finally {
        clearAllQueueArray();
        await getAllQueueData();
        totalNumberOfPatientsInQueue = calculatePatientInQueue();
        return Promise.resolve(!stopProcess && isPatientInQueue);
    }
};