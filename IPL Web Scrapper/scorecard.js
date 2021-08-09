let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
// data extract -> cheerio
//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
console.log("Before");

function processSingleMatch(url){
  request(url, cb);
}
function cb(error, response, html){
    // console.log('error:', error); //Print the error if one occurered
    //
    if(error){
        console.log('error:', error); //Print the error if one occurered
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
       // console.log(html); // Print the HTML for the request
    dataExtracter(html); 
    }
}

function dataExtracter(html){
    // search tool
    let searchTool = cheerio.load(html);
   // selector
    let bothInningsArr = searchTool(".Collapsible");
    let content = "";
    let json = {};

    for(let i=0;i<bothInningsArr.length;i++){
        //scoreCard = searchTool(bothInningsArr[i]).html();
        let teamNameElem = searchTool(bothInningsArr[i]).find("h5");
        let teamName = teamNameElem.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        
       // console.log(teamName);
        let batsManTableBodyAllRows = searchTool(bothInningsArr[i]).find(".table.batsman tbody tr");
       
        content += teamName;

        for(let j=0;j<batsManTableBodyAllRows.length;j++){
            let numberOfTds = searchTool(batsManTableBodyAllRows[j]).find("td");
            if(numberOfTds.length == 8){
                //let stats = searchTool(numberOfTds).text();
                //content += stats;
                json[searchTool(numberOfTds[0]).text().trim()] = [];
                    let data = {
                        "team": teamName,
                        "outBy":  searchTool(numberOfTds[1]).text(),
                        "runs":  searchTool(numberOfTds[2]).text(),
                        "balls":  searchTool(numberOfTds[3]).text(),
                        "four":  searchTool(numberOfTds[5]).text(),
                        "six":  searchTool(numberOfTds[6]).text(),
                        "sr":  searchTool(numberOfTds[7]).text()
                    }

                    json[searchTool(numberOfTds[0]).text().trim()].push(data);
              
                //   json.push(searchTool(numberOfTds[0]).text(), searchTool(numberOfTds[1]).text(),
                //     searchTool(numberOfTds[2]).text(), searchTool(numberOfTds[3]).text(), searchTool(numberOfTds[5]).text(),
                //     searchTool(numberOfTds[6]).text(), searchTool(numberOfTds[7]).text(), teamName);
            }
        }
        //console.log('```````````````````````````````');
        //fs.writeFileSync(`innings${i+1}.html`, scoreCard);
    }

     // console.log(content);
     //console.log(json);
    for(let i in json){
       // console.log(json[i][0]['team'])
        let teamPath = path.join(process.cwd(), 'players', json[i][0]['team']);
        if(!fs.existsSync(teamPath)){
            fs.mkdirSync(teamPath);
        }
            let data = {};
            data[i] = json[i];

            let playerPath =  path.join(teamPath, i+'.json');
            if(!fs.existsSync(playerPath)){
                fs.writeFileSync(playerPath, "");
            }
            data = JSON.stringify(data);
            fs.appendFileSync(playerPath, data);

       
    }
}

// function jsoncb(error, response, playerName, outBy, runs, balls, four, six, sr, teamName){
//     if(error){
//         console.log('error:', error); //Print the error if one occurered
//     }
//     else if(response.statusCode == 404){
//         console.log("Page Not Found");
//     }
//     else{
//        // console.log(html); // Print the HTML for the request
//         return playerJson(playerName, outBy, runs, balls, four, six, sr, teamName); 
//     }
// }


// function playerJson(playerName, outBy, runs, balls, four, six, sr, teamName){
//     let json = {};

//     json[playerName] = [];
//     let data = {
//         "team": teamName,
//         "outBy": outBy,
//         "runs": runs,
//         "balls": balls,
//         "four": four,
//         "six": six,
//         "sr": sr
//     }

//     json[playerName].push(data);
//     console.log(json);
//     return json;
// }

module.exports = {
    psm: processSingleMatch
}