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

    for(i=0; i<x; i++){
        gridHTML.innerHTML += "<tr>";
        for(j=0; j<y; j++){
            var cell = grid[i][j];
            if(cell[0] == "hidden"){
                html += "<td class=\"hidden\"></td>";
            }else if(cell[0] == "flagged"){
                html += "<td class=\"flagged\"></td>";
            }else{
                html += "<td class=\"discovered\"></td>";
            }
        }
        html += "</tr>";
    } 
    html += "</table>"
    gridHTML.innerHTML = html;
}


var grid = createGrid(10,10);
displayGrid(grid);