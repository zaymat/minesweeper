const getScores = () => {
    let scores = JSON.parse(localStorage.getItem("bestScores"));
    let table = document.getElementById("scores");
    let html = "";

    for(i=0; i<10; i++){
        html += "<tr>\n";
        html += "<th scope=\"row\">" + (i+1) + "</th>\n";
        html += "<td>" + (scores["easy"][i] === undefined ? "" : scores["easy"][i]) + "</td>\n";
        html += "<td>" + (scores["normal"][i] === undefined ? "" : scores["normal"][i]) + "</td>\n";
        html += "<td>" + (scores["hard"][i] === undefined ? "" : scores["hard"][i]) + "</td>\n";
        html += "</tr>\n"
    }
    table.innerHTML = html;
}

getScores();