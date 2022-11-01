enum WardType {
    INTENSIVE_CARE_WARD = 3,
    INFECTIOUS_DISEASE_WARD = 2,
    GENERAL_WARD = 1
};

enum WardStatus {
    OCCUPIED = 1,
    DISCHARGED_PENDING_SANITIZING = 2,
    SANITIZING = 3,
    AVAILABLE = 4
};

// export {
//     WardStatus,
//     WardType
// }