const occupyWard = async (wardId:number, patientId:number):Promise<void> => {
    const wardIndex = getWardIndexInArray(wardId);

    const ward = await fetchWardData(wardId);

    if (ward.currentStatus.toString().toLowerCase() !== "available") {
        alert(`Ward ${wardId} is not available now`);
        return;
    }
    
    const response = changeWardStatus(wardId, WardStatus.OCCUPIED, patientId);
    response.then(
        (value) => {
            refreshWardData(wardId);
        },
        (reason) => {
            alert(reason);
        }
    );
};