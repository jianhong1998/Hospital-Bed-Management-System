const host = "localhost";
const port = 8080;

const redirect = (url: string) => {
    window.location.replace(url);
};

const checkLocalStorage = ():void => {
    if (localStorage.user === undefined) {
        window.location.replace(`http://${host}:${port}/login`);
    } else if (window.location.pathname === "/") {
        window.location.replace(`http://${host}:${port}/dashboard`);
    }
};

if (document.readyState === "loading") {
    checkLocalStorage();
}