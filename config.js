const setConfig = () => {
    let conf = {};
    sessionStorage.setItem("lastSubmittedConf", document.forms["difficulty"]["difficulty"].value);

    switch(document.forms["difficulty"]["difficulty"].value){
        case "easy":
            conf["n"] = 9;
            conf["m"] = 9;
            conf["bombs"] = 10;
            break;
        case "normal":
            conf["n"] = 16;
            conf["m"] = 16;
            conf["bombs"] = 40;
            break;
        case "hard":
            conf["n"] = 30;
            conf["m"] = 16;
            conf["bombs"] = 99;
            break;
        
    }
    sessionStorage.setItem("conf", JSON.stringify(conf));
}

const setCustomConfig = () => {
    let m = document.forms["customConf"]["nbRows"].value;
    let n = document.forms["customConf"]["nbCols"].value;
    let bombs = document.forms["customConf"]["nbBombs"].value;

    if(n > 1 && n <= 30){
        document.getElementById("nbCols").className = "form-control is-valid";
    }else{
        document.getElementById("nbCols").className = "form-control is-invalid";
        return false;
    }

    if(m > 1 && m <= 24){
        document.getElementById("nbRows").className = "form-control is-valid";
    }else{
        document.getElementById("nbRows").className = "form-control is-invalid";
        return false;
    }

    if(bombs > 1 && bombs < n*m){
        sessionStorage.setItem("conf", JSON.stringify({"n":n, "m":m, "bombs":bombs}));
        sessionStorage.setItem("lastSubmittedCustomConf", JSON.stringify({"n":n, "m":m, "bombs":bombs}));
        document.getElementById("nbBombs").classList = "form-control is-valid";
        return true;
    }else{
        document.getElementById("nbBombs").className = "form-control is-invalid";
        return false;
    }
 
}

const displayLastConf = () => {
    document.getElementById(sessionStorage.getItem("lastSubmittedConf")).checked = true;

    let lastConf = JSON.parse(sessionStorage.getItem("lastSubmittedCustomConf"));
    document.getElementById("nbRows").value = lastConf["m"];
    document.getElementById("nbCols").value = lastConf["n"];
    document.getElementById("nbBombs").value = lastConf["bombs"];

}

displayLastConf();