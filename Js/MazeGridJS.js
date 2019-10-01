var canvas = document.getElementById('mycanvas');
canvas.style.marginTop = "1px"
canvas.style.marginLeft = "22px"
var context = canvas.getContext('2d');
context.canvas.width = 1320;
let width = context.canvas.width;
context.canvas.height = 480;
context.fillStyle = 'grey';
context.fillRect(0, 0, canvas.width, canvas.height);
let cols, rows;
let cellWidth = 40;
let gridder = [];
let current;
let stack = [];
let clearInterval = false;
let position = 0;
let moves = [];
let timerDiv = document.getElementById("timerDivDiv");
let timer = document.getElementById("timer");
let user = document.getElementById("user");
let score = 0;
let stopScore;
var audio = new Audio("../assests/music.mp3");
var popup=new Audio("../assests/popup.mp3")

function mazeDisplay() {

  cols = Math.floor(canvas.width / cellWidth);
  rows = Math.floor(canvas.height / cellWidth);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = new Cell(x, y);
      gridder.push(cell);
    }
  }



  current = gridder[0];
  strokeCells();
}

function strokeCells() {


  context.fillStyle = 'black';
  for (let cell of gridder) {
    cell.show();
  }
  current.visited = true;

  moves.push(current);

  current.highlight();
  // STEP 1
  let next = current.checkNeighbors();
  // STEP 1.a
  if (next) {
    next.visited = true;
    // STEP 1.b
    stack.push(current);
    // STEP 1.column
    removeWalls(current, next);
    // STEP 1.d
    current = next;
    // STEP 2
  } else if (stack.length > 0) {
    // STEP 2.a and 2.b
    current = stack.pop();

  }
  else {
    clearInterval = true;
    console.log("else")

  }
}

class Cell {
  constructor(column, row) {
    this.row = row;
    this.col = column;
    this.walls = [true, true, true, true]
    this.visited = false;
  }

  studentShow = () => {

    if (this.col == 15 && this.row == 6) {
      audio.pause();
      audio.currentTime = 0;
      let userDetails = JSON.parse(localStorage.getItem("userDetails"));

      let user = userDetails.find((u) => u.email == JSON.parse(localStorage.getItem("user")).email);
      if (!user.score || user.score > score) {
        user.score = score;
        let newUserDetails = userDetails.map((u) => {
          if (u.email == user.email)
            return user;
          else
            return u;
        })
        localStorage.setItem("userDetails", JSON.stringify(newUserDetails))
        popup.play();
        swal({
          title: "Congratulations!",
          text: `You have graduated and ${score} is your new Highest Score for you!`,
          icon: "success",
          button: "Re-Admit!",
        })
          .then(() => {
            location.reload();
          })
      }
      else {
        popup.play();
        swal({
          title: "Congratulations!",
          text: "You have graduated, but you were enable to beat your highest score!",
          icon: "success",
          button: "Re-Admit!",
        })
          .then(() => {
            location.reload();
          })
      }

    }
    else {

      let x = this.col * cellWidth;
      let y = this.row * cellWidth;
      var base_image = new Image();
      base_image.src = '../assests/student.png';
      base_image.onload = function () {
        context.drawImage(base_image, x + (cellWidth / 2) - 10, y + (cellWidth / 2) - 10, (cellWidth / 2) + 5, (cellWidth / 2) + 5);
      }
    }
  }
  degreeShow = () => {

    let x = 15 * cellWidth;
    let y = 6 * cellWidth;
    var base_image = new Image();
    base_image.src = '../assests/degree.png';
    base_image.onload = function () {
      context.drawImage(base_image, x + (cellWidth / 2) - 10, y + (cellWidth / 2) - 10, (cellWidth / 2) + 5, (cellWidth / 2) + 5);
    }
  }

  clearCircle = () => {
    let x = this.col * cellWidth;
    let y = this.row * cellWidth;
    if (x == 0 && y == 0)
      context.fillStyle = "gray";
    else
      context.fillStyle = "black";
   
    context.fillRect(x + 1, y + 1, cellWidth - 5, cellWidth - 5);
  }
  show() {
    let x = this.col * cellWidth;
    let y = this.row * cellWidth;
  

    if (this.walls[0]) {
      
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + cellWidth, y);
    }
    if (this.walls[1]) {
      context.moveTo(x + cellWidth, y);
      context.lineTo(x + cellWidth, y + cellWidth);
    }
    if (this.walls[2]) {
      context.moveTo(x + cellWidth, y + cellWidth);
      context.lineTo(x, y + cellWidth);
    }
    if (this.walls[3]) {
      context.moveTo(x, y + cellWidth);
      context.lineTo(x, y);
    }

    if (this.visited) {
      context.strokeStyle = 'gray';
      context.fillStyle = 'black';
      context.fillRect(x, y, cellWidth, cellWidth);

    }
    context.stroke();

  }

  checkNeighbors() {
    let neighbors = [];

    let top = gridder[index(this.col - 1, this.row)];
    let right = gridder[index(this.col, this.row + 1)];
    let bottom = gridder[index(this.col + 1, this.row)];
    let left = gridder[index(this.col, this.row - 1)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    } else {

      return undefined;
    }
  }


  highlight() {
    let x = this.col * cellWidth;
    let y = this.row * cellWidth;
    context.strokeStyle = 'none';
    context.fillStyle = 'gray';
    context.fillRect(x, y, cellWidth, cellWidth);
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.col - b.col;
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.row - b.row;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
function traverse(s, d) {

  let x = s * cellWidth;
  let y = d * cellWidth;
  context.beginPath();




  context.strokeStyle = 'pink';
  context.fillStyle = 'purple';
  context.arc(x + cellWidth / 2, y + cellWidth / 2, (cellWidth / 2) - 10, 0, Math.PI * 2, false);




  context.stroke();
}



window.addEventListener("load", () => {

  if (JSON.parse(localStorage.getItem("user")).user == "null") {

    location.assign("../loginpage.html")

  }
  else {

    let logger = JSON.parse(localStorage.getItem("user"));
    user.innerHTML = ` User: ${logger.email}`;

    timer.innerHTML = ` Time: ${score}`;

    var type = localStorage.getItem("levelType");
    if (type == 'easy')
      cellWidth = 60
    else
      if (type == 'moderate') {
        cellWidth = 40

        context.canvas.height = 520;
        context.fillStyle = 'grey';
      }
      else {
        cellWidth = 30
        context.canvas.height = 480;
        context.fillStyle = 'grey';
      }

    timerDiv = setInterval(() => (!clearInterval) ? strokeCells() : this.clearInterval(timerDiv), 1);
    mazeDisplay();
    strokeCells();
  }
})
window.addEventListener("keydown", (e) => {
  // up
  if (e.keyCode == 38) {

    if (!gridder[position].walls[0]) {
      gridder[position].clearCircle()
      position -= Math.floor(width / cellWidth)

      gridder[position].studentShow()
    }
  }
  //down
  else if (e.keyCode == 40) {

    if (!gridder[position].walls[2]) {
      gridder[position].clearCircle()
      position += Math.floor(width / cellWidth)

      gridder[position].studentShow()
    }
  }
  //right
  else if (e.keyCode == 39) {
    if (!gridder[position].walls[1]) {
      gridder[position].clearCircle()
      position += 1;
      gridder[position].studentShow()
    }
  }
  //left
  else if (e.keyCode == 37) {
    if (!gridder[position].walls[3]) {
      gridder[position].clearCircle()
      position -= 1;
      gridder[position].studentShow()
    }
  }

})

function play() {
  
  audio.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
  audio.play();


  stopScore = setInterval(() => {
    score++;
    timer.innerHTML = ` Time: ${score}`
  }, 1000)
  gridder[position].studentShow()
  gridder[position].degreeShow()
}

function logout() {
  localStorage.setItem("user", JSON.stringify({ user: "null" }));

}
