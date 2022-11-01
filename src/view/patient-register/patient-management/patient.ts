interface Patient {
    firstName:string,
    lastName:string,
    gender:Gender,
    category:Category,
    contactNumber:number,
    yearOfBirth:number,
    monthOfBirth:number
    dateOfBirth:number,
    nric:string,
    remarks:string
};

interface PatientFromDatabase extends Patient{
    patientId: number
};

enum Gender {
    MALE = 1,
    FEMALE = 2
};

enum Category {
    INTENSIVE_CARE = 1,
    INFECTIOUS_DISEASE = 2,
    GENERAL_CARE = 3
}

let currentPatient:PatientFromDatabase = {
    patientId: -1,
    firstName: "",
    lastName: "",
    gender: 0,
    category: 0,
    contactNumber: -1,
    remarks: "",
    nric: "",
    yearOfBirth: -1,
    monthOfBirth: -1,
    dateOfBirth: -1
};

interface PatientQueue {
    patientCategory: string,
    queue: number[]
};