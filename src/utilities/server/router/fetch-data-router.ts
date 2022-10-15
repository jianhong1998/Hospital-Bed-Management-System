import { Router } from "express";
import loginFetchDataRouter from "./login-fecth-data";
import wardFetchDataRouter from "./ward-fetch-data";

const fetchDataRouter = Router();

// Fetch login data
fetchDataRouter.use('/send-login-info', loginFetchDataRouter);

// Fetch ward data
fetchDataRouter.use('/ward', wardFetchDataRouter);


export default fetchDataRouter;