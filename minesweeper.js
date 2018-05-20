const createGrid = (x,y,n) => {
    let grid = [];
    for(i=0; i<x; i++){
        grid[i] = [];
        for(j=0; j<y; j++){
            grid[i][j] = ["hidden", 0];
        }
    }
    placeBombs(grid, n);
    return {"grid": grid, "nb_bomb": n, "hidden_cells": x*y};
}

const placeBombs = (grid, n) => {
    let remain = n;
    let x = grid.length;
    let y = grid[0].length;

    while(remain > 0){
        randX = Math.floor(Math.random() * x);
        randY = Math.floor(Math.random() * y);

        if(grid[randX][randY][1] != -1){
            grid[randX][randY][1] = -1;
            updateNeighboors(grid, randX, randY);
            remain--;
        }
    }
}

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

const updateNeighboors = (grid, x, y) => {
    let neighs = neighboors(grid, x, y);
    for(neigh of neighs){
        grid[neigh[0]][neigh[1]][1] += 1;
    }
}

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

const discover = (grid, x, y) => {
    pile = neighboors(grid["grid"], x, y);
    while(pile.length){
        let cell = pile.pop();
        if(grid["grid"][cell[0]][cell[1]][1] == 0 && grid["grid"][cell[0]][cell[1]][0] == "hidden"){
            pile = pile.concat(neighboors(grid["grid"], cell[0], cell[1]));
        }
        if(grid["grid"][cell[0]][cell[1]][0] == "hidden"){
            grid["hidden_cells"] -= 1;
        }
        grid["grid"][cell[0]][cell[1]][0] = "discovered";
    }
}

const handleLeftClick = (e) => {
    let coor = JSON.parse(e.id);
    let x = coor["x"];
    let y = coor["y"];

    grid["grid"][x][y][0] = "discovered";
    grid["hidden_cells"] -= 1;

    if(timer == 0){
        let d = new Date();
        timer = d.getTime();
        timerInterval = setInterval(updateTimer, 10);
    }

    if(grid["grid"][x][y][1] == 0){
        discover(grid, x, y);
        displayGrid(grid["grid"]);
    }else if(grid["grid"][x][y][1] == -1){
        let loose = document.getElementById("score");
        score.innerHTML = "YOU LOOSE";
        score.style.display = "block";
        displayStaticGrid(grid["grid"]);

        let d = new Date();
        t = d.getTime();
        let time = document.getElementById("timer");
        time.innerHTML = Math.round((t-timer)/10)/100 + " sec";
        timer = 0;
        clearInterval(timerInterval);

    }else if(checkWin(grid)){
        let score = document.getElementById("score");
        score.innerHTML = "YOU WIN";
        score.style.display = "block";

        displayStaticGrid(grid["grid"]);

        let d = new Date();
        t = d.getTime();
        let time = document.getElementById("timer");
        time.innerHTML = Math.round((t-timer)/10)/100 + " sec";
        clearInterval(timerInterval);

        updateScore(Math.round((t-timer)/10)/100);
        timer = 0;
        
    }else{
        displayGrid(grid["grid"]);
    }
}

const handleRightClick = (e) => {
    let coor = JSON.parse(e.id);
    let x = coor["x"];
    let y = coor["y"];

    if(timer == 0){
        let d = new Date();
        timer = d.getTime();
        timerInterval = setInterval(updateTimer, 1000);
    }

    if(grid["grid"][x][y][0] == "flagged"){
        grid["grid"][x][y][0] = "hidden";
    }else{
        grid["grid"][x][y][0] = "flagged";
    }
    displayGrid(grid["grid"]);
}

const checkWin = (grid) => {
    return (grid["hidden_cells"] == grid["nb_bomb"]);
}

const newGame = () => {
    let conf = JSON.parse(localStorage.getItem("conf"));
    timer = 0;
    clearInterval(timerInterval);

    if(conf){
        let n = conf["n"];
        let m = conf["m"];
        let bombs = conf["bombs"];

        grid = createGrid(n,m,bombs);
    }else{
        grid = createGrid(9,9,10);
    }
    let score = document.getElementById("score");
    score.innerHTML = "";
    score.style.display = "none";
    let time = document.getElementById("timer");
    time.innerHTML = "000";
    displayGrid(grid["grid"]);
}

const updateTimer = () => {
    let d = new Date();
    t = d.getTime();
    let time = document.getElementById("timer");
    time.innerHTML = String("00" + Math.round((t-timer)/1000)).slice(-3);
}

const updateScore = (score) => {
    let scores = JSON.parse(localStorage.getItem("bestScores"));
    if(scores == null){
        scores = {"easy": [], "normal": [], "hard": []};
    }
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

let grid;
let timer;
timer = 0;
let timerInterval;

newGame();
