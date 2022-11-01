// All form inputs
const nricInput = <HTMLInputElement>document.getElementById("input-nric");
const firstNameInput = <HTMLInputElement>document.getElementById("input-firstname");
const lastNameInput = <HTMLInputElement>document.getElementById("input-lastname");
const contactNumberInput = <HTMLInputElement>document.getElementById("input-contactnumber");
const dateOfBirthInput = <HTMLInputElement>document.getElementById("input-dateofbirth");
const genderInput = <HTMLSelectElement>document.getElementById("input-gender");
const categoryInput = <HTMLSelectElement>document.getElementById("input-category");
const remarksInput = <HTMLInputElement>document.getElementById("input-remarks");
const isNewPatientInput = <HTMLInputElement>document.getElementById("input-isnewpatient");

// Form and buttons
const patientRegisterForm = <HTMLFormElement>document.getElementById("form-patient-register");
const clearFormButton = <HTMLButtonElement>document.getElementById("button-clear-form");
const submitButtonPatientRegisterForm = <HTMLButtonElement>document.getElementById("submit-button-patient-register-form");

// Form input array
const patientRegisterFormInputArray: Array<HTMLInputElement | HTMLSelectElement> = [isNewPatientInput, nricInput, firstNameInput, lastNameInput, contactNumberInput, dateOfBirthInput, genderInput, categoryInput, remarksInput];

// Patient display table elements
const patientIdDisplayArea = <HTMLTableCellElement>document.getElementById('patient-id');
const firstNameDisplayArea = <HTMLTableCellElement>document.getElementById('first-name');
const lastNameDisplayArea = <HTMLTableCellElement>document.getElementById('last-name');
const genderDisplayArea = <HTMLTableCellElement>document.getElementById('gender');
const categoryDisplayArea = <HTMLTableCellElement>document.getElementById('category');
const contactNumberDisplayArea = <HTMLTableCellElement>document.getElementById('contact-number');
const dateOfBirthDisplayArea = <HTMLTableCellElement>document.getElementById('date-of-birth');
const remarksDisplayArea = <HTMLTableCellElement>document.getElementById('remarks');

const patientInfoDisplayTableElementsArray = [patientIdDisplayArea, firstNameDisplayArea, lastNameDisplayArea, genderDisplayArea, categoryDisplayArea, contactNumberDisplayArea, dateOfBirthDisplayArea, remarksDisplayArea];

const patientInfoDisplayTable = <HTMLTableElement>document.getElementById("table-patient-info-display");
const confirmButton = <HTMLButtonElement>document.getElementById("button-confirm-and-assign-ward");

// Other HTML Elements
const backToDashboardButton = <HTMLButtonElement>document.getElementById("button-back-to-dashboard");


// Reset all form field
const clearForm = (formInputArray: Array<HTMLInputElement | HTMLSelectElement>):void => {
    for (let formInput of formInputArray) {
        if (formInput.type === "select-one") {
            formInput.value = "0";
        } else {
            formInput.value = "";
        }
    }
}

// Enable and disable patient register form field according to the isNewPatientInput
const enableOrDisableFormField = () => {
    if (isNewPatientInput.checked) {
        submitButtonPatientRegisterForm.value = "Register";
    } else {
        submitButtonPatientRegisterForm.value = "Search";
    }
    
    for (let input of patientRegisterFormInputArray) {
        input.disabled = !isNewPatientInput.checked;
    }

    nricInput.disabled = false;
    categoryInput.disabled = false;
    isNewPatientInput.disabled = false;
}

// Clear patient info display table and hide
const clearPatientInfoDisplayTable = () => {
    for (let element of patientInfoDisplayTableElementsArray) {
        element.innerHTML = "";
    }
    patientInfoDisplayTable.style.display = "none";
    confirmButton.style.display = "none";
}

// Event listener
window.addEventListener("load", async () => {
    await getAllQueueData();
    totalNumberOfPatientsInQueue = calculatePatientInQueue();
    console.log(queueArray);
});
patientRegisterForm.addEventListener(
    "submit",
    async (ev:SubmitEvent) => {
        ev.preventDefault();
        // Incompleted - submitPatient() have to change to be a function to use http endpoint to communicate with backend and database
        currentPatient = {
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
        }

        submitPatient()
        .then(
            value => {
                currentPatient = value;
            }
        )
        .catch(
            reason => {
                if (reason.errorMessage !== undefined) {
                    if (reason.errorMessage.includes("ER_DUP_ENTRY")) {
                        alert("NRIC has been used. The patient may not be a new patient.");
                        return;
                    }
                }

                alert(reason.errorMessage);
            }
        )
        .finally(
            () => {
                if (currentPatient.patientId !== -1) {
                    patientInfoDisplayTable.style.display = "block";
                    confirmButton.style.display = "block";

                    patientIdDisplayArea.innerHTML = currentPatient.patientId.toString();
                    firstNameDisplayArea.innerHTML = currentPatient.firstName;
                    lastNameDisplayArea.innerHTML = currentPatient.lastName;
                    genderDisplayArea.innerHTML = currentPatient.gender.toString();
                    categoryDisplayArea.innerHTML = currentPatient.category.toString();
                    contactNumberDisplayArea.innerHTML = currentPatient.contactNumber.toString();
                    remarksDisplayArea.innerHTML = currentPatient.remarks.length === 0? "N.A.": currentPatient.remarks;

                    const dateOfBirth = `${("0" + currentPatient.dateOfBirth).slice(-2)}/${("0" + currentPatient.monthOfBirth).slice(-2)}/${("000" + currentPatient.yearOfBirth).slice(-4)}`;
                    dateOfBirthDisplayArea.innerHTML = dateOfBirth;
                }
            }
        );
    }
);
clearFormButton.addEventListener(
    "click",
    (ev:MouseEvent) => {
        ev.preventDefault();
        clearForm(patientRegisterFormInputArray);
    }
);
isNewPatientInput.addEventListener(
    "change",
    () => {
        enableOrDisableFormField();
        clearForm(patientRegisterFormInputArray);
    }
);
confirmButton.addEventListener("click", async (ev:MouseEvent) => {
    ev.preventDefault();
    
    await sendPatientToQueue(currentPatient);
    
    totalNumberOfPatientsInQueue = calculatePatientInQueue();
    
    clearPatientInfoDisplayTable();

    clearForm(patientRegisterFormInputArray);
})
backToDashboardButton.addEventListener("click", (ev:MouseEvent) => {
    ev.preventDefault();

    window.location.replace("http://localhost:8080/dashboard");
});