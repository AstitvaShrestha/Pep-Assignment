let helpObj = require("./command/help");
let organizeObj = require("./command/organize");
let treeObj = require("./command/tree");

let inputArr = process.argv.slice(2);
let command = inputArr[0];
let path = inputArr[inputArr.length-1];

switch(command){
    case "help":
        helpObj.list();
        break;

    case "tree":
        treeObj.create(path);
        break;
    
    case "organize":
        organizeObj.organize(path);
        break;
    
    default:
        console.log("Enter correct command");
}