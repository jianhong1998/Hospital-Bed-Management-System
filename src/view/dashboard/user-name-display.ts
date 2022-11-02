const nameDisplayArea = <HTMLSpanElement>document.getElementById("name-display");


nameDisplayArea.innerHTML = `${JSON.parse(localStorage.user).firstName}${JSON.parse(localStorage.user).lastName.length > 0 ? " " + JSON.parse(localStorage.user).lastName : ""}`;