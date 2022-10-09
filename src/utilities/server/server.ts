import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import buildRouter from './router/build-router';
import loginFetchDataRouter from './router/login-fecth-data';

const server = express();
const currentFolder = path.join(__dirname);
const loginFilePath = "../../view/";

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// Visit homepage
server.get("/", (req, res) => {
    const htmlFileName = "homepage.html";
    const htmlFilePath = "../../view/homepage";

    res.sendFile(path.join(currentFolder, htmlFilePath, htmlFileName));
});

// Visit dashboard
server.get("/dashboard" , (req, res) => {
    const htmlFileName = "dashboard.html";
    const htmlFilePath = "../../view/dashboard";

    res.sendFile(path.join(currentFolder, htmlFilePath, htmlFileName));
})

// Visit login page via GET Request
server.get("/login", (req, res) => {
    const loginHtmlFileName = "login.html";
    const loginHtmlFilePath = "../../view/login";

    res.sendFile(path.join(currentFolder, loginHtmlFilePath, loginHtmlFileName));
});

// Access .css from visit "http://[host]:[port]/view/[filePath]/[fileName]"
server.use("/view", express.static(path.join(currentFolder, loginFilePath)));
// Access .js file from visit "http://[host]:[port]/script/[filePath]/[fileName]"
server.use("/script", buildRouter);

// Fetch data from database, visit "http://[host]:[port]/fetch/[route]"
server.use('/fetch', loginFetchDataRouter);

export default server;