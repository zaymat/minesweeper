const createGrid = (x,y) => {
    var grid = [];
    for(i=0; i<x; i++){
        grid[i] = [];
        for(j=0; j<y; j++){
            grid[i][j] = ["hidden", 0];
        }
    }
    return grid;
}

const placeBombs = (grid, n) => {
    var remain = n;
    var x = grid.length;
    var y = grid[0].length;

    while(remain > 0){
        randX = Math.floor(Math.random() * x);
        randY = Math.floor(Math.random() * x);

        if(grid[randX][randY][1] != -1){
            grid[randX][randY][1] = -1;
            updateNeighboors(grid, randX, randY);
            remain--;
        }
    }
}

const neighboors = (grid, x, y) => {
    var neighboors = []
    var n = grid.length;
    var m = grid[0].length;

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
    var neighs = neighboors(grid, x, y);
    for(neigh of neighs){
        grid[neigh[0]][neigh[1]][1] += 1;
    }
}

const displayGrid = (grid) => {
    var gridHTML = document.getElementById("grid");
    var x = grid.length;
    var y = grid[0].length;

    var html = "<table>";

    for(j=0; j<y; j++){
        gridHTML.innerHTML += "<tr>";
        for(i=0; i<x; i++){
            var cell = grid[i][j];
            if(cell[0] == "hidden"){
                html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:handleRightClick(this);return false;\" onclick=\"handleLeftClick(this)\" class=\"hidden\"></td>";
            }else if(cell[0] == "flagged"){
                html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:handleRightClick(this);return false;\" onclick=\"handleLeftClick(this)\" class=\"flagged\"></td>"
            }else{
                html += "<td id=\'{" + "\"x\":" + i + ", \"y\":" + j + "}\' oncontextmenu=\"javascript:handleRightClick(this);return false;\" onclick=\"handleLeftClick(this)\" class=\"discovered\">"+ cell[1] + "</td>"
            }
        }
        html += "</tr>";
    } 
    html += "</table>"
    gridHTML.innerHTML = html;
}

const discover = (grid, x, y) => {
    pile = neighboors(grid, x, y);
    while(pile.length){
        var cell = pile.pop();
        if(grid[cell[0]][cell[1]][1] == 0 && grid[cell[0]][cell[1]][0] == "hidden"){
            pile = pile.concat(neighboors(grid, cell[0], cell[1]));
        }
        grid[cell[0]][cell[1]][0] = "discovered";
    }
}

const handleLeftClick = (e) => {
    var coor = JSON.parse(e.id);
    var x = coor["x"];
    var y = coor["y"];

    grid[x][y][0] = "discovered";
    if(grid[x][y][1] == 0){
        discover(grid, x, y);
    }else if(grid[x][y][1] == -1){
        var loose = document.getElementById("score");
        loose.innerHTML = "You loose !";
    }
    displayGrid(grid);
}

const handleRightClick = (e) => {
    var coor = JSON.parse(e.id);
    var x = coor["x"];
    var y = coor["y"];
    if(grid[x][y][0] == "flagged"){
        grid[x][y][0] = "hidden";
    }else{
        grid[x][y][0] = "flagged";
    }
    displayGrid(grid);
}


var grid = createGrid(10,10);
placeBombs(grid, 10);

displayGrid(grid);