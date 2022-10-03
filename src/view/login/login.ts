// Makesure local storage is clear
localStorage.clear();

const userData: {username: string, firstName: string, lastName: string} = {
    username: "",
    firstName: "",
    lastName: ""
};

const errorMessage:string[] = [];

const collectLoginInfo = ():{username: string, password: string, errorMessage: string[]} => {
    const dataObj: {
        username:string,
        password:string,
        errorMessage: string[]
    } = {
        username: "",
        password: "",
        errorMessage: []
    };
    
    // Get input field
    const usernameInputField = <HTMLInputElement>document.getElementById('input-username');
    const passwordInputField = <HTMLInputElement>document.getElementById('input-password');

    // Check if any input field is missing
    if (usernameInputField == undefined || passwordInputField == undefined) {
        dataObj.errorMessage.push("Username or Password input field is missing\n");
        return dataObj;
    }

    dataObj.username = usernameInputField.value;
    dataObj.password = passwordInputField.value;

    // Check if any input field is not filled
    if (dataObj.username.length == 0) {
        dataObj.errorMessage.push("Please fill up Username.\n");
    }
    if (dataObj.password.length == 0) {
        dataObj.errorMessage.push("Please fill up Password.\n");
    }

    return dataObj;
}

const fetchUserData = async (username: string, password: string):Promise<any> => {
    try {
        const url = `http://localhost:8080/fetch/send-login-info/?username=${username}&password=${password}`;
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        return {errorMessage: error};
    }
};

const getUserFromDatabase = async (username: string, password: string): Promise<void> => {    
    await fetchUserData(username, password)
    .then(
        value => {
            if (value[0] === undefined) {
                errorMessage.push("Username or password is wrong\n");
                return;
            }
    
            userData.username = value[0].username;
            userData.firstName = value[0].first_name;
            userData.lastName = value[0].last_name;
        },
        reason => {
            errorMessage.push(reason);
        }
    );
};

const userVarification = ():boolean => {
    return errorMessage.length === 0 && userData.username.length > 0;
};

const submitLoginInfo = async (): Promise<void> => {
    while (errorMessage.length > 0) {
        errorMessage.pop();
    }
    
    const dataObj = collectLoginInfo();

    // Check if any errorMessage is returned by collectLoginInfo()
    if (dataObj.errorMessage.length > 0) {
        let alertMessage:string = "";
        for (let error of dataObj.errorMessage) {
            alertMessage += error;
        }
        alert(alertMessage);
        return;
    }

    // get user data from database
    await getUserFromDatabase(dataObj.username, dataObj.password);

    // Verify login data
    if (userVarification()) {
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.replace("http://localhost:8080/");
    } else {
        let alertMessage:string = "";
        for (let message of errorMessage) {
            alertMessage += message + "\n";
        }
        
        alert(alertMessage);
    };
};