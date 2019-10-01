var submitButton = document.getElementById('submitLink');
submitButton.onclick = submitSignUpForm
var userName = document.getElementById('name');
var email = document.getElementById('email');
var password = document.getElementById('password');
var inpFields = document.querySelectorAll('[type="text"]');
var link = document.querySelector('#submitLink');
link.disabled = true;
var currentUser;



//disable submit button when any of the fields are empty


for (i = 0; i < inpFields.length; i++) {
    inpFields[i].addEventListener('input', () => {
        let values = [] //whatever the values i write in the input boxes
        inpFields.forEach(v => values.push(v.value)) //push the value in values array jis bhy input box pr lkhun
        inpFields.disabled = values.includes('') //inludes  checks this is present or not
    })
}

function submitSignUpForm() {
    var usersArray = [];
    if (userName.value != '' && email.value != '' && password.value != '') {


        // if local storage is empty then create a new array of usersObject
        if (localStorage.getItem('userDetails') == null) {
            usersArray.push({
                "username": userName.value,
                "email": email.value,
                "password": password.value
            });

            currentUser = usersArray;
            console.log(currentUser);
            var StringUsersArray = JSON.stringify(usersArray)
            localStorage.setItem('userDetails', StringUsersArray);
            Levelspage();

        } else if (localStorage.getItem('userDetails') != null) {
            var getUsers = JSON.parse(localStorage.getItem('userDetails'));
            let obj = {
                "username": userName.value,
                "email": email.value,
                "password": password.value,
                "score":null
            }

            var existingEmail = getUsers.find(user => user.email == obj.email)
            if (existingEmail != null) {
                document.getElementById('alreadyexisted').innerHTML = "email already exists"
                email.style.borderBottom = "3px solid red";

            } else if (existingEmail == undefined) {

                document.getElementById('alreadyexisted').innerHTML = ""
                email.style.borderBottom = "1px solid green";
                //i have to stop the same user to create its account so i will stop it by using its email in getUsers parsed array
                getUsers.push(obj);
                currentUser = obj;
               
                localStorage.setItem("userDetails", JSON.stringify(getUsers))
                Levelspage();
            }

        }

    }

}


function Levelspage() {
    document.getElementById("submitLink").href = "../loginpage.html";
}