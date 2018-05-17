const createGrid = (x,y) => {
    var grid = [];
    for(i=0; i<x; i++){
        grid[i] = []
        for(j=0; j<y; j++){
            grid[i][j] = ["hidden", 0];
        }
    }
    return grid;
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