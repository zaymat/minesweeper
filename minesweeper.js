// create a new grid
const createGrid = (x,y,n) => {
    let grid = [];
    for(i=0; i<x; i++){
        grid[i] = [];
        for(j=0; j<y; j++){
            grid[i][j] = ["hidden", 0];
        }
    }
    placeBombs(grid, n); // place bombs in the grid
    return {"grid": grid, "nb_bomb": n, "hidden_cells": x*y};
}

// place bombs in the grid
const placeBombs = (grid, n) => {
    let remain = n;
    let x = grid.length;
    let y = grid[0].length;

    while(remain > 0){
        // select a random cell
        randX = Math.floor(Math.random() * x);
        randY = Math.floor(Math.random() * y);

        if(grid[randX][randY][1] != -1){
            grid[randX][randY][1] = -1;
            updateNeighboors(grid, randX, randY); // Update adjacent cells value
            remain--;
        }
    }
}

// Return the list of the non-bomb neighboors of cell at coordinate (x, y)
const neighboors = (grid, x, y) => {
    let neighboors = []
    let n = grid.length;
    let m = grid[0].length;

    for (i=-1; i<= 1; i++){
        for (j=-1; j<= 1; j++){
            if (x+i >= 0 && x+i < n && y+j >= 0 && y+j < m && grid[x+i][y+j][1] != -1){
                neighboors.push([x+i,y+j]);
            }
        }
    }
    return neighboors;
}

// Update value of the neighboors of a bombs
const updateNeighboors = (grid, x, y) => {
    let neighs = neighboors(grid, x, y);
    for(neigh of neighs){
        grid[neigh[0]][neigh[1]][1] += 1;
    }
}

// Display the grid
const displayGrid = (grid) => {
    let gridHTML = document.getElementById("grid");
    let x = grid.length;
    let y = grid[0].length;

    let html = "<table class=\"grid\">";

    for(j=0; j<y; j++){
        gridHTML.innerHTML += "<tr>";
        for(i=0; i<x; i++){
            let cell = grid[i][j];
            if(cell[0] == "hidden"){
                html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:handleRightClick(this);return false;\" onclick=\"handleLeftClick(this)\" class=\"hidden\"></td>";
            }else if(cell[0] == "flagged"){
                html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:handleRightClick(this);return false;\" class=\"flagged\"><img src=\"assets/flag.png\" class=\"image\"></img></td>"
            }else{
                switch(cell[1]){
                    case -1:
                        html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:return false;\" class=\"discovered\"><img src=\"assets/bomb.png\" class=\"image\"></img></td>"
                        break;
                    case 0:
                        html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:return false;\" class=\"discovered number0\"></td>"
                        break;
                    default:
                        html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:return false;\" class=\"discovered number" + cell[1] + "\">" + cell[1] + "</td>"
                        break;
                }
            }
        }
        html += "</tr>";
    } 
    html += "</table>"
    gridHTML.innerHTML = html;
}

// Display the grid when the game is finished
const displayStaticGrid = (grid) => {
    let gridHTML = document.getElementById("grid");
    let x = grid.length;
    let y = grid[0].length;

    let html = "<table class=\"grid\">";

    for(j=0; j<y; j++){
        gridHTML.innerHTML += "<tr>";
        for(i=0; i<x; i++){
            let cell = grid[i][j];
            if(cell[0] == "hidden"){
                html += "<td oncontextmenu=\"javascript:return false;\" class=\"hidden\"></td>";
            }else if(cell[0] == "flagged"){
                html += "<td oncontextmenu=\"javascript:return false;\" class=\"flagged\"><img src=\"assets/flag.png\" class=\"image\"></img></td>"
            }else{
                switch(cell[1]){
                    case -1:
                        html += "<td oncontextmenu=\"javascript:return false;\" class=\"discovered\"><img src=\"assets/bomb.png\" class=\"image\"></img></td>"
                        break;
                    case 0:
                        html += "<td oncontextmenu=\"javascript:return false;\" class=\"discovered number0\"></td>"
                        break;
                    default:
                        html += "<td oncontextmenu=\"javascript:return false;\" class=\"discovered number" + cell[1] + "\">" + cell[1] + "</td>"
                        break;
                }
            }
        }
        html += "</tr>";
    } 
    html += "</table>"
    gridHTML.innerHTML = html;
}

// Discover cells with no bomb nearby
const discover = (grid, x, y) => {
    pile = neighboors(grid["grid"], x, y); // compute neighboors of the cell
    while(pile.length){ // while the pile is not empty
        let cell = pile.pop(); // get the head of the pile
        if(grid["grid"][cell[0]][cell[1]][1] == 0 && grid["grid"][cell[0]][cell[1]][0] == "hidden"){ // if the cell is empty and hidden, discover the cell and add its neighboors to the pile
            pile = pile.concat(neighboors(grid["grid"], cell[0], cell[1]));
        }
        if(grid["grid"][cell[0]][cell[1]][0] == "hidden"){// if the case has a value, discover it but not its neighboors
            grid["hidden_cells"] -= 1;// Decrement total hidden cells
        }
        grid["grid"][cell[0]][cell[1]][0] = "discovered";
    }
}

// Handle left click event on cell
const handleLeftClick = (e) => {
    // get coordinates from id
    let coor = JSON.parse(e.id);
    let x = coor["x"];
    let y = coor["y"];

    // discover the cell
    grid["grid"][x][y][0] = "discovered";
    grid["hidden_cells"] -= 1;

    // if it is the first play of the game, start the timer
    if(timer == 0){
        let d = new Date();
        timer = d.getTime();
        timerInterval = setInterval(updateTimer, 10);
    }

    // If the case is empty, discover is neighboors
    if(grid["grid"][x][y][1] == 0){
        discover(grid, x, y);
        displayGrid(grid["grid"]);
    }else if(grid["grid"][x][y][1] == -1){ // if it is a bomb, finish the game
        // Display modal
        let score = document.getElementById("score");
        score.innerHTML = "YOU LOOSE";
        score.style.display = "block";

        // Display final grid
        displayStaticGrid(grid["grid"]);

        // End the timer and print the total time
        let d = new Date();
        t = d.getTime();
        let time = document.getElementById("timer");
        time.innerHTML = String("00" + Math.round((t-timer)/1000)).slice(-3);
        timer = 0;
        clearInterval(timerInterval);

    }else if(checkWin(grid)){ // if the player win the game
        // Display the modal
        let score = document.getElementById("score");
        score.innerHTML = "YOU WIN";
        score.style.display = "block";

        // Display final grid
        displayStaticGrid(grid["grid"]);

        // End the timer and print the total time
        let d = new Date();
        t = d.getTime();
        let time = document.getElementById("timer");
        time.innerHTML = String("00" + Math.round((t-timer)/1000)).slice(-3);
        clearInterval(timerInterval);

        // Update score page
        updateScore(Math.round((t-timer)/10)/100);
        timer = 0;
        
    }else{
        // Display the updated grid
        displayGrid(grid["grid"]);
    }
}

// Handle right click on cell
const handleRightClick = (e) => {
    // get coordinates from id
    let coor = JSON.parse(e.id);
    let x = coor["x"];
    let y = coor["y"];

    // If it is the first play of the game, start timer
    if(timer == 0){
        let d = new Date();
        timer = d.getTime();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // If the cell is already flagged, de-flag it
    if(grid["grid"][x][y][0] == "flagged"){
        grid["grid"][x][y][0] = "hidden";
    }else{ // else flag it
        grid["grid"][x][y][0] = "flagged";
    }
    // Display updated grid
    displayGrid(grid["grid"]);
}

// Check if the game is winned
const checkWin = (grid) => {
    return (grid["hidden_cells"] == grid["nb_bomb"]); // Compare hidden cells number to bomb number
}

// Start a new game
const newGame = () => {
    // Create score table in localSotrage if not already set
    let scores = JSON.parse(localStorage.getItem("bestScores"));
    if(scores == null){
        scores = {"easy": [], "normal": [], "hard": []};
    }
    localStorage.setItem("bestScores", JSON.stringify(scores));
    
    // get conf from localStorage
    let conf = JSON.parse(localStorage.getItem("conf"));
    timer = 0;
    clearInterval(timerInterval);

    if(conf){
        let n = conf["n"];
        let m = conf["m"];
        let bombs = conf["bombs"];

        grid = createGrid(n,m,bombs);
    }else{ // default value 
        grid = createGrid(9,9,10);
    }
    // Reset score and timer
    let score = document.getElementById("score");
    score.innerHTML = "";
    score.style.display = "none";
    let time = document.getElementById("timer");
    time.innerHTML = "000";
    displayGrid(grid["grid"]);
}

// Update timer value 
const updateTimer = () => {
    let d = new Date();
    t = d.getTime();
    let time = document.getElementById("timer");
    time.innerHTML = String("00" + Math.round((t-timer)/1000)).slice(-3);
}

// Update score table 
const updateScore = (score) => {
    let scores = JSON.parse(localStorage.getItem("bestScores"));
    let conf = JSON.parse(localStorage.getItem("conf"));

    if(conf["n"] == 9 &&  conf["m"] == 9 && conf["bombs"] == 10){
        scores["easy"] = insertScore(scores["easy"], score).slice(0, 9);
    }else if(conf["n"] == 16 &&  conf["m"] == 16 && conf["bombs"] == 40){
        scores["normal"] = insertScore(scores["normal"], score).slice(0, 9);
    }else if(conf["n"] == 30 &&  conf["m"] == 16 && conf["bombs"] == 99){
        scores["hard"] = insertScore(scores["hard"], score).slice(0, 9);
    }
    localStorage.setItem("bestScores", JSON.stringify(scores));
}

// insert score in the table recursively
const insertScore = (list, score) => {
    if(list.length == 0){
        return [score];
    }else{
        let worst = list.pop();
        if(score < worst){
            return insertScore(list,score).concat(worst);
        }else{
            return list.concat(worst).concat(score);
        }
    }
}

// Create global variable (grid and timer) to be accessible anywhere
let grid;
let timer;
timer = 0;
let timerInterval;

// Start a new game when player arrive on the website
newGame();
