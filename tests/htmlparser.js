/*
*  Method : Parsing HTML file for finding whether navbar and footer is used or not,
*             using "htmlparser2"
*
*/


let htmlparser = require("htmlparser2");
let fs = require('fs');
let path = require('path');
let lodash = require('lodash');

let totalComments = 0, classes=0;
let obj = []
let parser = new htmlparser.Parser({
  onopentag: function(name, attribs){
    if(attribs.class === "row"){
      obj.push({"grid": "bootstrap row is defined"})
    }
    if(attribs.class){
      classes += 1
      let attr = attribs.class;
      if(attr === "col" || attr.includes("col")){
        obj.push({"grid": "bootstrap col is defined"})
      }
    }
    if(name === "ul" && attribs.class){
      obj.push({"nav": "opening tag is defined"})
    }
    if(name == "footer"){
      obj.push({"footer": "opening tag is defined"})
    }
    if(name == "head"){
      obj.push({"head": "opening tag is defined"})
    }
    if(name === "meta" && attribs.author && attribs.content){
      obj.push({"meta": "AUTHOR and CONTENT is defined"})
    }
    if(name == "link" && attribs.href && attribs.href.includes("?")){
      let fonts = attribs.href.split('?')[0]
      if(fonts == "https://fonts.googleapis.com/css"){
        obj.push({"custom_fonts": "Google Fonts is defined"})
      }
    }
    if(name == "link" && attribs.href){
      if(attribs.href.includes("maxcdn.bootstrapcdn.com")){
        obj.push({"bootstrap_version": attribs.href.split('/')[4]})
      }
    }
  },
  onclosetag: function(tagname){
    if(tagname === "ul"){
      obj.push({"nav": "closing tag is defined"})
    }
    if(tagname === "footer"){
      obj.push({"footer": "closing tag is defined"})
    }
    if(tagname === "head"){
      obj.push({"head": "closing tag is defined"})
    }
  },
  oncomment : function (){
    totalComments += 1
  }
}, {decodeEntities: true});
parser.write(fs.readFileSync(path.join(__dirname + '/../index.html')));
parser.end();

obj.push({'total_comments': totalComments}, {'class_element': classes})

obj = lodash.uniqWith(obj, lodash.isEqual);

console.log(obj)
