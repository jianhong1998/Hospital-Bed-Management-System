const submitButon = document.getElementById('input-submit') as HTMLElement;
const username = <HTMLInputElement>document.getElementById('input-username');
const password = <HTMLInputElement>document.getElementById('input-password');

submitButon.addEventListener("click", submitLoginInfo);

const submitLoginInfoIfEnterPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        submitLoginInfo();
    }
};
username.addEventListener('keypress', submitLoginInfoIfEnterPress);
password.addEventListener("keypress", submitLoginInfoIfEnterPress);