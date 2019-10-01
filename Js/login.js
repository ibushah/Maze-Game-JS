var login = document.getElementById('loginlink');
login.onclick = loginButton
var email = document.getElementById('email');
var password = document.getElementById('password');
var inpFields = document.querySelectorAll('[type="text"]');
var link = document.querySelector('#loginlink');
var para = document.getElementById('alreadyexisted');
link.disabled = true;
var currentUser;



function loginButton() {
    if (email.value != '' && password.value != '') {
        console.log(email.value, password.value)

        //search the email and password against the user
        if(localStorage.getItem('userDetails'))
        {
        var allRegisteredUsers = JSON.parse(localStorage.getItem('userDetails'));
        var findUser = allRegisteredUsers.find(user => (user.email == email.value && user.password == password.value));
        
        if (findUser != null) {
            console.log("user is registered cool ");
            let loggedAIn={
                email:email.value,
                password:password.value
            }
            localStorage.setItem("user",JSON.stringify(loggedAIn));
            Levelspage();

        } else if (findUser == undefined) {
            console.log("user is not registered")
            para.innerHTML = "Email or password is incorred"
            para.style.color = "red";

        }
    }
    else
    {
        para.innerHTML = "Email or password is incorred"
        para.style.color = "red";
    }
    }
}


function Levelspage() {
    document.getElementById("loginlink").href = "Pages/Levelspage.html";
}

