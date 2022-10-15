import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import buildRouter from './router/build-router';
import fetchDataRouter from './router/fetch-data-router';

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
// Example: "http:localhost:8080/fetch/send-login-info" to get login user data from database
server.use('/fetch', fetchDataRouter);

export default server;