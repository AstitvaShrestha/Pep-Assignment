let fs = require("fs");
let path = require("path"); 

function create(paths){

    let allentities = fs.readdirSync(paths);
    let baseFolderName = path.basename(paths);

    console.log("|__", baseFolderName)
    
    for(let i=0;i<allentities.length;i++){
        let entityName = allentities[i];
        let fullPath = path.join(paths, entityName);
        let statsOfAPath = fs.lstatSync(fullPath);

        if(statsOfAPath.isFile()){
            console.log("\t|—–", entityName);
        }

    }
    console.log("tree command executed with path ", paths+"\n");
    return "Tree executed";
}


module.exports = {
    create: create
}