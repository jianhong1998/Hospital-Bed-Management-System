const wardArray:Array<Ward> = [];

const displayWardData = async ():Promise<void> => {
    try {
        const response = await fetchAllWardsData();
        wardArray.push(...response);
    } catch (error) {
        console.log(error);
        return;
    }
    
    const wardContainer = <HTMLDivElement>document.getElementById("ward-container");

    for (let i = 0 ; i < wardArray.length; i++) {
        const containerDivNode = document.createElement("div");

        containerDivNode.setAttribute("id", `ward-${wardArray[i].wardId}`);
        containerDivNode.classList.add("ward-detail-container");

        // Discharge Button
        const dischargeButtonNode = document.createElement("button");
        const dischargeButtonTextNode = document.createTextNode("Discharge");
        dischargeButtonNode.classList.add("discharge-button");
        dischargeButtonNode.appendChild(dischargeButtonTextNode);
        
        
        let divArray:HTMLDivElement[] = [
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div"),
            document.createElement("div")
        ];

        divArray[0].classList.add("ward-id");
        divArray[1].classList.add("ward-type");
        divArray[2].classList.add("ward-status");
        divArray[3].classList.add("ward-patient-id");

        let textNodeArray:Node[] = [
            document.createTextNode(`Ward Id: ${wardArray[i].wardId}`),
            document.createTextNode(`Ward Type: ${wardArray[i].wardType}`),
            document.createTextNode(`Ward Status: ${wardArray[i].currentStatus}`),
            document.createTextNode(`Patient Id: ${wardArray[i].patientId === null? "-" : wardArray[i].patientId}`)
        ]
    
        for (let j = 0; j < textNodeArray.length; j++) {
            divArray[j].appendChild(textNodeArray[j]);
            containerDivNode.appendChild(divArray[j]);
        }

        containerDivNode.appendChild(dischargeButtonNode);
        wardContainer.appendChild(containerDivNode);
    }
};

const refreshWardData = async (wardId:number):Promise<void> => {
    const wardDetailContainer = <HTMLDivElement>document.getElementById(`ward-${wardId}`);

    const wardIndex = getWardIndexInArray(wardId);

    const fetchedWard = await fetchWardData(wardId);

    if (fetchedWard.wardId !== wardArray[wardIndex].wardId) {
        console.log(fetchedWard);
        return Promise.reject("Wrong ward fetched from database");
    }

    wardArray[wardIndex].currentStatus = fetchedWard.currentStatus;
    wardArray[wardIndex].patientId = fetchedWard.patientId;

    wardDetailContainer.children[2].innerHTML = `Ward Status: ${wardArray[wardIndex].currentStatus}`;
    wardDetailContainer.children[3].innerHTML = `Patient Id: ${wardArray[wardIndex].patientId === null? "-" : wardArray[wardIndex].patientId}`;
};

const addDischargeFunctionToButton = ():void => {
    const dischargeButtonArray = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("discharge-button");
    for (let i = 0; i < dischargeButtonArray.length ; i++) {
        dischargeButtonArray[i].addEventListener("click", () => {
            const parent = <HTMLDivElement>dischargeButtonArray[i].parentElement;
            const wardIdContainer = parent.children[0];
            const wardId = parseInt(wardIdContainer.innerHTML.charAt(wardIdContainer.innerHTML.length - 1));
            
            dischargeWard(wardId);
        });
    }
};

const refreshAllWardData = () => {
    for (let i = 0; i < wardArray.length; i++) {
        refreshWardData(wardArray[i].wardId);
    }
};

window.addEventListener("load",displayWardData);

setTimeout(
    () => addDischargeFunctionToButton(),
    2000
);

