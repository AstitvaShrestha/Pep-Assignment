let fs = require("fs");
let path = require("path"); 

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function organize(paths){
  
    organisedFiles = path.join(paths, "organized files");
    if(! fs.existsSync(organisedFiles)){
    fs.mkdirSync(organisedFiles);
    }
    
    let allentities = fs.readdirSync(paths);

    for(let i=0;i<allentities.length;i++){

        entityName = allentities[i];
        let fullPath = path.join(paths, entityName);
        let statsOfAPath = fs.lstatSync(fullPath);
  
        if(statsOfAPath.isFile()){
          
            let ext = path.extname(fullPath);
            let basename = path.basename(fullPath);
       
            let flag = 0;

            for(let key in types){
                 let typePath = path.join(organisedFiles, key);
                 if(! fs.existsSync(typePath)){
                    fs.mkdirSync(typePath);
                    }
               
                
                for(let k=0;k<types[key].length;k++){
                    if(ext.slice(1) == types[key][k]){
                        flag = 1;
                        let destPath =  path.join(typePath, basename);
                        fs.copyFileSync(fullPath, destPath);
                    }
                }

                }
                
                if(flag == 0){
                    let typePath = path.join(organisedFiles, "others");
                    if(! fs.existsSync(typePath)){
                        fs.mkdirSync(typePath);
                        }
                    
                    let destPath =  path.join(typePath, basename);
                    fs.copyFileSync(fullPath, destPath);
            }

        }

    }


    console.log("organize command executed with path ", paths+"\n");

    return "Organize executed";
}


module.exports = {
    organize: organize
}