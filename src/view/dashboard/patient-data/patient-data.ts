// const patientInWardArray:Array<PatientFromDatabase> = [];

// const getPatientInWardData = (patientId: number):Promise<PatientFromDatabase> => {
//     if (patientInWardArray.length === 0) {
//         return Promise.reject({errorMessage: "Error: No patient in patientInWardArray."});
//     }

//     patientInWardArray.sort((a, b) => {return a.patientId - b.patientId;});

//     let patient:PatientFromDatabase | undefined;

//     for (let i = 0 ; i < patientInWardArray.length ; i++) {
//         if (patientId === patientInWardArray[i].patientId) {
//             patient = patientInWardArray[i];
//             break;
//         }
//     }

//     if (patient === undefined) {
//         return Promise.reject({errorMessage: `Error: Patient ${patientId} is not found in patientInWardArray.`});
//     }

//     return Promise.resolve(patient);
// };

// const removePatientFromPatientInWardArray = (patientId: number):Promise<PatientFromDatabase> => {
//     if (patientInWardArray.length === 0) {
//         return Promise.reject({errorMessage: "Error: No patient is in patientInWardArray."});
//     }
    
//     let index:number = -1;
    
//     for (let i = 0 ; i < patientInWardArray.length ; i++) {
        
//         if (patientId === patientInWardArray[i].patientId) {
//             index = i;
//             break;
//         }
//     }

//     if (index < 0) {
//         return Promise.reject({errorMessage: `Error: Patient ${patientId} is not in patientInWardArray`});
//     }

//     const temp = patientInWardArray[patientInWardArray.length - 1];
//     patientInWardArray[patientInWardArray.length - 1] = patientInWardArray[index];
//     patientInWardArray[index] = temp;

//     return Promise.resolve(<PatientFromDatabase>patientInWardArray.pop());
// };

const getPatientData = async (patientid:number):Promise<PatientFromDatabase> => {

    const responseJson = await fetch(`http://localhost:8080/fetch/patient/get-patient-with-id/?patientId=${patientid}`);

    const responseObj = await responseJson.json();

    if (Object.getPrototypeOf(responseObj)[0] === "errorMessage") {
        return Promise.reject(responseObj.errorMessage);
    }

    return Promise.resolve(responseObj[0]);
};

