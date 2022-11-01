import { Router } from "express";
import loginFetchDataRouter from "./login-fetch-data";
import patientFetchDataRouter from "./patient-fetch-data";
import patientQueueFetchDataRouter from "./patient-queue-fetch-data";
import wardFetchDataRouter from "./ward-fetch-data";

const fetchDataRouter = Router();

// Fetch login data
fetchDataRouter.use('/send-login-info', loginFetchDataRouter);

// Fetch ward data
fetchDataRouter.use('/ward', wardFetchDataRouter);

// Fetch patient data
fetchDataRouter.use('/patient', patientFetchDataRouter);

// Fetch patient queue data
fetchDataRouter.use('/patient-queue', patientQueueFetchDataRouter);

export default fetchDataRouter;