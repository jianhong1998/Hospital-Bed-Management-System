// General Care queue
const generalCarePatientQueue:PatientQueue = {
    patientCategory: "General Care",
    queue: []
};

// Intensive Care queue
const intensiveCarePatientQueue:PatientQueue = {
    patientCategory: "Intensive Care",
    queue: []
};

// Infectious Disease queue
const infectiousDiseasePatientQueue:PatientQueue = {
    patientCategory: "Infectious Disease",
    queue: []
};

// Queue Collection
const queueArray:PatientQueue[] = [generalCarePatientQueue, intensiveCarePatientQueue, infectiousDiseasePatientQueue];

// number of patients in queue
const calculatePatientInQueue = ():number => {
    return generalCarePatientQueue.queue.length + intensiveCarePatientQueue.queue.length + infectiousDiseasePatientQueue.queue.length;
};

let totalNumberOfPatientsInQueue:number = 0;
