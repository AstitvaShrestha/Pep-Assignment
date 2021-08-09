let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);
let options = [];
let filepaths = [];

for(let i=0;i<inputArr.length;i++){
    let firstchar = inputArr[i].charAt(0);
    if(firstchar=='-'){
        options.push(inputArr[i]);
    }
    else{
        filepaths.push(inputArr[i]);
    }
}

if(options.length==0){
    options.push("no");
}

let f=0;
for(let i=0;i<options.length;i++){
    let option = options[i];
    if(option=='-n' || option=='-b'){
        if(f==0){
            f=1;
        }
        else{
            delete options[i];
            continue;
        }
    }

switch(option){

    case "no": let content = noOptions(filepaths);
                if(typeof content != 'undefined'){
                    console.log(content);
                }
                break;
                
    case "-s":  let content1 = noOptions(filepaths);
                content1 = lineBreakReduce(content1, options.slice(i+1));
                if(typeof content1 != 'undefined'){
                    console.log(content1);
                }
                break;

    case "-n":  if(i==0){
                let content2 = noOptions(filepaths);
                content2 = noToAllLines(content2);
                 if(typeof content2 != 'undefined'){
                  console.log(content2);
                 }
                }
                break;

    case "-b": if(i==0){
                let content3 = noOptions(filepaths); 
                content3 = noToNEmptyLines(content3);
                if(typeof content3 != 'undefined'){
                    console.log(content3);
                }
            }
                break;

    default: console.log("Enter correct options");
}
}

function noOptions(filepaths){

    let content = "";

    for(let i=0; i<filepaths.length; i++){
        filePath = filepaths[i];
        let fileBase = path.basename(filePath);
        let dirName = path.dirname(filePath);
        if(!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()){
            console.log("File: ", fileBase, "doesn't exist at", dirName);
            return undefined;
        }

        else{
            let extname = path.extname(filePath);
            if(extname == '.txt' || extname == '.md'){
                content += fs.readFileSync(filePath)+"\r\n";
            }
        }
    }

    //console.log(content);
    return content;
}


function lineBreakReduce(content, options){

    if(typeof content == 'undefined'){
        return;
    }
    let input = content.split("\r");

  //  console.log(input);
    for(let i=0; i<input.length-1;i++){

        if(input[i]=='\n' && input[i+1]=='\n'){
            delete input[i];
        }
    }
   // console.log(input);
    content = input.join("\r");
    //console.log(content);
    if(options.length!=0){
        if(options[0]=='-n'){
         content =  noToAllLines(content);
        }
        else{
           content = noToNEmptyLines(content);
        }
    }
    //console.log(content);
    return "File after removing linebreaks:- \n"+content;
}

function noToAllLines(content){
  
    if(typeof content == 'undefined'){
        return;
    }

    let input = content.split("\r\n");
 
    for(let i=0; i<input.length-1;i++){

            input[i] = (i+1) +" " +input[i];
        
    }

    content = input.join("\r\n");
   // console.log(content);
   return "Lines are Numbered:- \n"+content;
}

function noToNEmptyLines(content){

    if(typeof content == 'undefined'){
        return;
    }

    let input = content.split("\r\n");
    let c = 1;
    //console.log(input);
    for(let i=0; i<input.length;i++){
        if(input[i]!="" ){
            input[i] = (c) +" " +input[i];
            c++;
        }
    }
    
    content = input.join("\r\n");
   // console.log(content);
   return "Non Empty Lines are Numbered:- \n"+content;
}