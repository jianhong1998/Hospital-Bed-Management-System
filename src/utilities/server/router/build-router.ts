import express , { Router } from 'express';
import path from 'path';

// To access the builded .js file
const buildRouter = Router();

const currentFolder = path.join(__dirname);
const loginFilePath = "../../../../build/view";

buildRouter.use('/', express.static(path.join(currentFolder, loginFilePath)));

export default buildRouter;