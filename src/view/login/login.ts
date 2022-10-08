// Makesure local storage is clear
localStorage.clear();


// declare user data object and error message array
const userData: {userId: number, username: string, firstName: string, lastName: string} = {
    userId: 0,
    username: "",
    firstName: "",
    lastName: ""
};
const errorMessage:string[] = [];

// Function to collect login data from form
const collectLoginInfo = ():{username: string, password: string, errorMessage: string[]} => {
    const dataObj = {
        username: <string>"",
        password: <string>"",
        errorMessage: <Array<string>>[]
    };
    
    // Get input field
    const usernameInputField = <HTMLInputElement>document.getElementById('input-username');
    const passwordInputField = <HTMLInputElement>document.getElementById('input-password');

    // Check if any input field is missing
    if (usernameInputField == undefined || passwordInputField == undefined) {
        dataObj.errorMessage.push("Username or Password input field is missing.");
        return dataObj;
    }

    dataObj.username = usernameInputField.value;
    dataObj.password = passwordInputField.value;

    // Check if any input field is not filled
    if (dataObj.username.length == 0) {
        dataObj.errorMessage.push("Please fill up Username.");
    }
    if (dataObj.password.length == 0) {
        dataObj.errorMessage.push("Please fill up Password.");
    }

    return dataObj;
}

// Function to send a GET request to backend end point
// Backend end point will return a json (user information)
// Will return an empty array if the username or password is wrong
const fetchUserData = async (username: string, password: string):Promise<any> => {
    // {userId: string, username: string, firstName: string, lastName: string, errorMessage: string[]}
    const returnData: {
        userId: string,
        username: string,
        firstName: string,
        lastName: string,
        errorMessage: string[]
    } = {
        userId: "",
        username: "",
        firstName: "",
        lastName: "",
        errorMessage: []
    }

    try {
        const url = `http://localhost:8080/fetch/send-login-info/`;
        const requestBody = {
            username: username,
            password: password
        };
        const requestHeader = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }

        const response = await fetch(url, {
            method: "POST".toUpperCase(),
            headers: requestHeader,
            body: JSON.stringify(requestBody)
        });
        
        return response.json();
    } catch (error) {
        // return {errorMessage: error};
        returnData.errorMessage.push(<string>error);
    }
};

// read data from the json returned by fetchUserData()
// Will assign the user data into the user data object
const readUserDataFromFetch = async (username: string, password: string): Promise<void> => {    
    await fetchUserData(username, password)
    .then(
        value => {
            if (value[0] === undefined) {
                errorMessage.push("Username or password is wrong\n");
                return;
            }
            userData.userId = parseInt(value[0].user_id);
            userData.username = value[0].username;
            userData.firstName = value[0].first_name;
            userData.lastName = value[0].last_name;
        },
        reason => {
            errorMessage.push(reason);
        }
    );
};

// Verify the user data object
// Return false if username in user data object is empty and error message array is not empty
const userVarification = ():boolean => {
    return errorMessage.length === 0 && userData.username.length > 0;
};

const alertUser = (errorMessage: Array<string>):void => {
    let alertMessage:string = "";
    
    for (let i = errorMessage.length - 1; i >= 0; i--) {
        alertMessage += errorMessage[i];
        if (alertMessage.charAt(alertMessage.length - 1) !== "\n") {
            alertMessage += "\n";
        }
        errorMessage.pop();
    }
        
    alert(alertMessage);
}

// proccess for submitting login information
const submitLoginInfo = async (): Promise<void> => {

    // Clear error message array
    while (errorMessage.length !== 0) {
        errorMessage.pop();
    }
    
    const inputDataObj = collectLoginInfo();

    // Check if any error message is returned by collectLoginInfo()
    if (inputDataObj.errorMessage.length > 0) {
        alertUser(inputDataObj.errorMessage);
        return;
    }

    // get user data from database
    await readUserDataFromFetch(inputDataObj.username, inputDataObj.password);

    if (errorMessage.length > 0) {
        alertUser(errorMessage);
        return;
    }

    // Verify login data
    if (userVarification()) {
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.replace("http://localhost:8080/");
    } else {
        alertUser(errorMessage);
    };
};