function lists(){
    console.log("List of all commands");
    console.log("1. node main.js tree path");
    console.log("2. node main.js organize path");
    console.log("3. node main.js help", "\n");
    return "Help executed";
}

module.exports = {
    list: lists
}