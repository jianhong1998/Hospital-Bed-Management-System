// When the page is loaded
// Display Ward and get all queue data
window.addEventListener("load", async () => {
    await displayWardData();
    await getAllQueueData();
    console.log(queueArray);
    await assignWardService();
});


// Add discharge function to discharge button
const addDischargeFunctionToButton = ():void => {
    const dischargeButtonArray = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("discharge-button");
    for (let i = 0; i < dischargeButtonArray.length ; i++) {
        dischargeButtonArray[i].addEventListener("click", () => {
            const parent = <HTMLDivElement> dischargeButtonArray[i].parentElement;
            const wardId = parseInt(parent.id.split('-')[1]);
            
            dischargeWard(wardId);
        });
    }
};

setTimeout(
    () => addDischargeFunctionToButton(),
    2000
);

// Display Patient
const displayPatientInfo = async (patientId: number):Promise<void> => {
    // console.log(patientId);

    try {
        // GET patient
        const patient = await getPatientData(patientId);
        
        const patientIdDisplayArea = <HTMLTableCellElement>document.getElementById('patient-id');
        const firstNameDisplayArea = <HTMLTableCellElement>document.getElementById('first-name');
        const lastNameDisplayArea = <HTMLTableCellElement>document.getElementById('last-name');
        const genderDisplayArea = <HTMLTableCellElement>document.getElementById('gender');
        const categoryDisplayArea = <HTMLTableCellElement>document.getElementById('category');
        const contactNumberDisplayArea = <HTMLTableCellElement>document.getElementById('contact-number');
        const dateOfBirthDisplayArea = <HTMLTableCellElement>document.getElementById('date-of-birth');
        const remarksDisplayArea = <HTMLTableCellElement>document.getElementById('remarks');

        const displayTable = <HTMLTableElement>document.getElementById("table-patient-info-display");
        const closeButton = <HTMLButtonElement> document.getElementById("button-close-patient-info-container");
        const container = <HTMLDivElement> displayTable.parentElement;
        
        patientIdDisplayArea.innerHTML = patient.patientId.toString();
        firstNameDisplayArea.innerHTML = patient.firstName;
        lastNameDisplayArea.innerHTML = patient.lastName;
        genderDisplayArea.innerHTML = patient.gender.toString();
        categoryDisplayArea.innerHTML = patient.category.toString();
        contactNumberDisplayArea.innerHTML = patient.contactNumber.toString();
        dateOfBirthDisplayArea.innerHTML = `${("0" + patient.dateOfBirth).slice(-2)} / ${("0" + patient.monthOfBirth).slice(-2)} / ${("000" + patient.yearOfBirth).slice(-4)}`;;
        remarksDisplayArea.innerHTML = patient.remarks === null ? patient.remarks : "N.A.";

        // Hide ward display block
        const refreshAllWardsButton = <HTMLButtonElement> document.getElementById("button-refresh-all-wards");
        const wardContainer = <HTMLDivElement> document.getElementById("ward-container");

        refreshAllWardsButton.style.display = "none";
        wardContainer.style.display = "none";

        // Unhide the block
        container.style.display = "block";
        displayTable.style.display = "block";
        closeButton.style.display = "block";
    } catch (error) {
        if (Object.keys((error as any)).includes("errorMessage")) {
            alert ((error as {errorMessage:string}).errorMessage);
            return;
        }

        if ((error as Error).message.toLowerCase().includes("failed to fetch")) {
            alert("Error: Server is no response, please try again after 3 seconds.");
            return;
        }

        alert(error);
    }
};

// Close Patient Info Table
const closeButton = <HTMLButtonElement> document.getElementById("button-close-patient-info-container");

const clearPatientInfoTable = ():void => {
    const patientIdDisplayArea = <HTMLTableCellElement>document.getElementById('patient-id');
    const firstNameDisplayArea = <HTMLTableCellElement>document.getElementById('first-name');
    const lastNameDisplayArea = <HTMLTableCellElement>document.getElementById('last-name');
    const genderDisplayArea = <HTMLTableCellElement>document.getElementById('gender');
    const categoryDisplayArea = <HTMLTableCellElement>document.getElementById('category');
    const contactNumberDisplayArea = <HTMLTableCellElement>document.getElementById('contact-number');
    const dateOfBirthDisplayArea = <HTMLTableCellElement>document.getElementById('date-of-birth');
    const remarksDisplayArea = <HTMLTableCellElement>document.getElementById('remarks');

    const patientInfoDisplayTableElementsArray = [patientIdDisplayArea, firstNameDisplayArea, lastNameDisplayArea, genderDisplayArea, categoryDisplayArea, contactNumberDisplayArea, dateOfBirthDisplayArea, remarksDisplayArea];

    for (let i = 0 ; i < patientInfoDisplayTableElementsArray.length ; i++) {
        patientInfoDisplayTableElementsArray[i].innerHTML = "-";
    }
}

const closePatientInfoContainer = ():void => {
    const closeButton = <HTMLButtonElement> document.getElementById("button-close-patient-info-container");
    const displayTable = <HTMLTableElement> document.getElementById("table-patient-info-display");
    const container = <HTMLDivElement> displayTable.parentElement;
    const refreshAllWardsButton = <HTMLButtonElement> document.getElementById("button-refresh-all-wards");
    const wardContainer = <HTMLDivElement> document.getElementById("ward-container");

    clearPatientInfoTable();

    refreshAllWardsButton.style.display = "";
    wardContainer.style.display = "";

    closeButton.style.display = "";
    displayTable.style.display = "";
    container.style.display = "";
}

closeButton.addEventListener("click", closePatientInfoContainer);



// Process patient data when click on the patient id
const wardPatientIdElementArray = <HTMLCollectionOf<HTMLDivElement>> document.getElementsByClassName('ward-patient-id');

setTimeout(
    () => {
        for (let i = 0; i < wardPatientIdElementArray.length ; i++) {
            wardPatientIdElementArray[i].addEventListener("click", () => {
                const wardId = parseInt((<HTMLDivElement> wardPatientIdElementArray[i].parentElement).id.split('-')[1]);
            
                const ward = wardArray[getWardIndexInArray(wardId)];
                    
                const patientId = ward.patientId;
        
                if (patientId !== null) {
                    displayPatientInfo(patientId);
                }
            });
        }
    },
    2000
);


// Assign patient to ward every 30 seconds
setInterval(
    () => {
        assignWardService();
    },
    10000
);