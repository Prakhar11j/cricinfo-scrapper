const fs      = require('fs')
const path    = require('path')
const cheerio = require('cheerio')
const request = require('request')
const xlsx    = require('xlsx')

function processScorecard(url){
    request(url,cb)
}

function cb(err,respone,html){
    if(err!=null){
        console.log(err);
    }
    else{
        let $ = cheerio.load(html)
        let details = $(".match-header-container .description")
        let arr  = details.text().split(",")
        let venue = arr[1]
        let date  = arr[2]
        let result  = $(".match-header-container .status-text").text()
        let innings = $(".card.content-block.match-scorecard-table>.Collapsible")
        let htmlString = ""

        for(let i=0;i<innings.length;i++){
            // htmlString =  $(innings[i]).html()
            let teamName  = $(innings[i]).find("h5").text().split("INNINGS")[0].trim()
            let opponentIndex = i==0?1:0
            let opponentName  =  $(innings[opponentIndex]).find("h5").text().split("INNINGS")[0].trim()
            let cInnings = $(innings[i])
            let allRows  = cInnings.find(".table.batsman tbody tr")
            console.log(venue+" || "+date+" || "+teamName+" || "+opponentName);
            for(let j=0;j<allRows.length;j++){
                let allCols =  $(allRows[j]).find("td")
                if($(allCols[0]).hasClass("batsman-cell")){
                    let playerName = $(allCols[0]).text().trim()
                    let runs       = $(allCols[2]).text().trim()
                    let balls      = $(allCols[3]).text().trim()
                    let fours      = $(allCols[5]).text().trim()
                    let sixes      = $(allCols[6]).text().trim()
                    let strikeRate = $(allCols[7]).text().trim()
                    processPlayer(teamName,playerName,opponentName,runs,balls,fours,sixes,strikeRate,venue,date,result)
                    // console.log(playerName +"  :  "+runs+"  "+balls+"  "+fours+"  "+sixes+"  "+strikeRate);

                }
            }

        }      

    }
}

function processPlayer(teamName,playerName,opponentName,runs,balls,fours,sixes,strikeRate,venue,date,result){
    let teamPath = path.join(__dirname,"ipl",teamName)
    if(!fs.existsSync(teamPath)){
        fs.mkdirSync(teamPath)
    }

    let filePth = path.join(teamPath,playerName+".xlsx")
    let content = excelReader(filePth,playerName)
    let playerObj = {
        teamName,
        playerName,
        opponentName,
        date,
        venue,
        runs,
        balls,
        fours,
        sixes,
        strikeRate,
        result
    }
    content.push(playerObj)
    excelWriter(filePth,content,playerName)

}

function excelWriter(filePth,json,sheetName){
    let newWB = xlsx.utils.book_new()
    let newWS = xlsx.utils.json_to_sheet(json)
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName)
    xlsx.writeFile(newWB, filePth)
}

function excelReader(filePth,sheetName){
    if(!fs.existsSync(filePth)){
        return []
    }
    let wb = xlsx.readFile(filePth)
    let excelData = wb.Sheets[sheetName]
    let ans = xlsx.utils.sheet_to_json(excelData)
    return ans
}

module.exports = {
    process : processScorecard
}