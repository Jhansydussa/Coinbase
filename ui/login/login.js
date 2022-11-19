const onChangeHandler = () => {    
    const errorSpan = document.getElementById('errorSpan');
    errorSpan.innerHTML = '';
}
const loginHandler = () => {
    const userName = document.getElementById('EmailId')?.value;
    const password =  document.getElementById('password')?.value;
    const userObj = {
        Email: userName,
        Password: password
    }
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:8080/loginUser',
        data: userObj,
        success: () => {
           location.href = "../userManagment/userManagment.html"
        },
        error: (error) => {
            const {responseJSON} = error;
            const {message} = responseJSON;
            const errorSpan = document.getElementById('errorSpan');
            errorSpan.innerHTML = message;
        }
    })
}