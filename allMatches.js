const cheerio = require('cheerio')
const request = require('request')
const scorecardObj = require('./scorecard')

function getAllMatchesLink(url){
    request(url,function cb2(err,response,html){
        if(err){
            console.log(err);
        }
        else{
            let setTools = cheerio.load(html)
            let anchor   = setTools("a[data-hover='Scorecard']")
            for(let i=0;i<anchor.length;i++){
                let link = "https://www.espncricinfo.com"+setTools(anchor[i]).attr("href")
                scorecardObj.process(link)
            }
        }
    })
}

module.exports = {
    getAllMatches : getAllMatchesLink
}