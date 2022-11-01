const verifyContactNumber = (contactNumber: number):boolean => {
    let contactNumberLength:number = 0;
    let temp:number = contactNumber;
    while (temp >= 1) {
        temp = temp / 10;
        contactNumberLength++;
    }

    if (contactNumberLength != 8) {
        return false;
    }

    const firstDigit = Math.floor(contactNumber / 10000000);

    return firstDigit === 6 || firstDigit === 8 || firstDigit === 9;
};

const verifyNric = (nric:string):boolean => {
    // Check length (must be 9 characters)
    if (nric.length !== 9) {
        return false;
    }

    // Check first character
    if (nric.charAt(0) !== "S" && nric.charAt(0) !== "T" && nric.charAt(0) !== "G") {
        return false;
    }

    // Check last character
    if (!Number.isNaN(parseInt(nric.charAt(nric.length - 1)))) {
        return false;
    }

    // Check digits
    for (let i = 1; i < nric.length - 1 ; i++) {
        if (Number.isNaN(parseInt(nric.charAt(i)))) {
            return false;
        }
    }

    return true;
}

const verifyDateOfBirth = (dateOfBirth: Date):boolean => {
    const today = new Date();
    
    return !(dateOfBirth.getFullYear() >= today.getFullYear() && dateOfBirth.getMonth() >= today.getMonth() && dateOfBirth.getDate() > today.getDate());
}

const verifyGender = (gender:number):boolean => {
    return gender === 1 || gender === 2;
}

const verifyCategory = (category: number):boolean => {
    return category >= 1 && category <= 3;
}

// Collect patient info from form fields
// Check all values
// If all values are valid, then return Patient
const createPatient = ():Promise<Patient> => {
    try {
        // Check contact number
        if (!verifyContactNumber(parseInt(contactNumberInput.value))) {
            return Promise.reject("Contact number is invalid");
        }

        // Check NRIC
        if (!verifyNric(nricInput.value.toUpperCase())) {
            return Promise.reject("NRIC is invalid");
        }

        // Check Birthday
        if (!verifyDateOfBirth(<Date>dateOfBirthInput.valueAsDate)) {
            return Promise.reject("Date of birth is invalid");
        }

        // Check Gender
        if (!verifyGender(parseInt(genderInput.value))) {
            return Promise.reject("Please select patient's gender");
        }

        // Check Category
        if (!verifyCategory(parseInt(categoryInput.value))) {
            return Promise.reject("Please select patient's category");
        }

        // Process data and return a patient
        const patient:Patient = {
            nric: nricInput.value.toUpperCase(),
            firstName: firstNameInput.value.toUpperCase(),
            lastName: lastNameInput.value.toUpperCase(),
            gender: parseInt(genderInput.value),
            dateOfBirth: (<Date>dateOfBirthInput.valueAsDate).getDate(),
            monthOfBirth: (<Date>dateOfBirthInput.valueAsDate).getMonth() + 1,
            yearOfBirth: (<Date>dateOfBirthInput.valueAsDate).getFullYear(),
            remarks: remarksInput.value,
            category: parseInt(categoryInput.value),
            contactNumber: parseInt(contactNumberInput.value)
        }
        
        return Promise.resolve(patient);
    } catch (error) {
        return Promise.reject(error);
    }
}

// POST exist patient's nric and category to backend
// Return updated patient's info
const updatePatientCategory = async (nric: string, category:number):Promise<PatientFromDatabase> => {
    try {
        let fetchUrl = "http://localhost:8080/fetch/patient/edit-patient-category";
        const postRequestHeader = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
    
        const fetchResponse = await fetch(fetchUrl, {
            method: "POST",
            headers: postRequestHeader,
            body: JSON.stringify({nric, category})
        });
    
        const fetchData = await fetchResponse.json();

        if (Object.keys(fetchData)[0] === "errorMessage") {
            return Promise.reject({errorMessage: fetchData.errorMessage});
        }

        return Promise.resolve(<PatientFromDatabase>fetchData);
    } catch (error) {
        const errorMessage = ((error as unknown) as Error).message + "\nPlease refresh the page and try again."
        return Promise.reject({errorMessage});
    }
}

// A set of patient submit process
// Collect patient info from form fields and process with all value verification
// Finally return a Promise of PatientFromDatabase
// errorMessage will be contained in Promise.reject()
const submitPatient = async ():Promise<PatientFromDatabase> => {
    try {
        // If isNewPatientInput is checked, then proceed to create new patient and store into database
        if (isNewPatientInput.checked) {
            //Create new patient and store into database

            let errorMessage:string = "";

            const patient = await createPatient()
            .catch(reason => {
                errorMessage += reason;
            });

            if (errorMessage.length > 0) {
                return Promise.reject({errorMessage});
            }

            if (patient !== undefined) {
                const createPatientUrl = "http://localhost:8080/fetch/patient/new-patient/";
                const requestHeader = {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                };

                const sendNewPatientInfoResponse = await fetch(createPatientUrl , {
                    method: "POST",
                    headers: requestHeader,
                    body: JSON.stringify(patient)
                });

                const responseObj = await sendNewPatientInfoResponse.json();

                if (Object.keys(responseObj).includes("errorMessage")) {
                    return Promise.reject(responseObj);
                }
                
                return Promise.resolve(responseObj);
            } else {
                return Promise.reject({errorMessage: "patient is not created"});
            }
        } else {
            //GET exist patient from database

            const nric = nricInput.value.toUpperCase();
            const category = parseInt(categoryInput.value);
            
            if (!verifyNric(nric)) {
                return Promise.reject({errorMessage: "NRIC is invalid"});
            }

            const patient = await updatePatientCategory(nric, category);
            return Promise.resolve(patient);
        }
    } catch (err) {
        let errorMessage = "";

        if (Object.keys(((err as unknown) as Error)).includes("message")) {
            errorMessage = ((err as unknown) as Error).message;
        } else if (Object.keys(((err as unknown) as {errorMessage: string}))) {
            errorMessage = ((err as unknown) as {errorMessage: string}).errorMessage;
        }

        return Promise.reject({errorMessage});
    }
};

const sendPatientToQueue = async (patient: PatientFromDatabase):Promise<void> => {
    if (patient.patientId < 0) {
        alert("Error: No patient is pending to be sent to queue. Please search or register a patient.");
        return;
    }
    
    const sendResult = await addPatientToQueue(patient.patientId, patient.category);

    if (sendResult) {
        alert(`${patient.firstName} ${patient.lastName} has been sent to queue ${patient.category}.`);
    }
};

const getPatientWithPatientId = async (patientId: number):Promise<PatientFromDatabase> => {
    const fetchUrl = `http://localhost:8080/fetch/patient/get-patient-with-id/?patientId=${patientId}`;

    try {
        const responseJson = await fetch(fetchUrl);
        const responseArray = <PatientFromDatabase[]>(await responseJson.json());

        return Promise.resolve(responseArray[0]);
    } catch (error) {
        const errorMessage = ((error as unknown) as Error).message;
        return Promise.reject({errorMessage});
    }
    
};