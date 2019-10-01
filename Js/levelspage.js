


window.addEventListener("load", () => {
    if (JSON.parse(localStorage.getItem("user")).user == "null") {

        location.assign("../loginpage.html")

    }
    else {
        console.log(localStorage.getItem("user"))
        console.log("hey")
    }
})

function logout() {
    localStorage.setItem("user", JSON.stringify({ user: "null" }));
   
}

function level(type) {
    
    localStorage.setItem("levelType", type)
    location.assign("../Pages/MazeGrid.html")
}