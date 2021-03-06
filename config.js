// convert form value to map configuration JSON ans store configuration in local storage
const setConfig = () => {
    let conf = {};
    // Store conf to be reuse next time
    localStorage.setItem("lastSubmittedConf", document.forms["difficulty"]["difficulty"].value);

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
    localStorage.setItem("conf", JSON.stringify(conf));
}

// store a custom configuration in the local storage
const setCustomConfig = () => {
    // Gather form value
    let m = document.forms["customConf"]["nbRows"].value;
    let n = document.forms["customConf"]["nbCols"].value;
    let bombs = document.forms["customConf"]["nbBombs"].value;

    // Validation for nbCols
    if(n > 1 && n <= 30){
        document.getElementById("nbCols").className = "form-control is-valid";
    }else{
        document.getElementById("nbCols").className = "form-control is-invalid";
        return
    }

    // Validation for nbRows
    if(m > 1 && m <= 24){
        document.getElementById("nbRows").className = "form-control is-valid";
    }else{
        document.getElementById("nbRows").className = "form-control is-invalid";
        return 
    }

    // Validation for nbBombs
    if(bombs > 1 && bombs < n*m){
        // If all fields are valid, set conf in localStorage 
        localStorage.setItem("conf", JSON.stringify({"n":n, "m":m, "bombs":bombs}));
        localStorage.setItem("lastSubmittedCustomConf", JSON.stringify({"n":n, "m":m, "bombs":bombs}));
        document.getElementById("nbBombs").classList = "form-control is-valid";
    }else{
        document.getElementById("nbBombs").className = "form-control is-invalid";
    }
}

// Display last used configuration at page reload
const displayLastConf = () => {
    document.getElementById(localStorage.getItem("lastSubmittedConf")).checked = true;

    let lastConf = JSON.parse(localStorage.getItem("lastSubmittedCustomConf"));
    document.getElementById("nbRows").value = lastConf["m"];
    document.getElementById("nbCols").value = lastConf["n"];
    document.getElementById("nbBombs").value = lastConf["bombs"];

}

displayLastConf();