const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const request = require('request')
const getAllMatchesObject = require('./allMatches')

const iplPath = path.join(__dirname,"ipl")
if(!fs.existsSync(iplPath)){
    fs.mkdirSync(iplPath)
}

request(url,cb)
function cb(err,respone,html){
    if(err!=null){
        console.log(err);
    }   
    else{
        let setTools = cheerio.load(html)
        let anchor   = setTools("a[data-hover='View All Results']")
        let link     = "https://www.espncricinfo.com"+anchor.attr("href")

        getAllMatchesObject.getAllMatches(link)
        
    }
}

