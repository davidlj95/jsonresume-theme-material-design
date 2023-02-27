const fs = require("fs");
const {renderTemplate} = require("./index.js");


let rawResumeJson = fs.readFileSync('resume.json')
let resumeJson = JSON.parse(rawResumeJson.toString())
fs.writeFileSync('resumeTemplate.html', renderTemplate(resumeJson))