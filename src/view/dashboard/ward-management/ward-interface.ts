// import { WardType, WardStatus } from './ward-enum';

interface Ward {
    wardId: number;
    wardType: WardType;
    currentStatus: WardStatus;
    patientId: (number | null);
};

// export default Ward;