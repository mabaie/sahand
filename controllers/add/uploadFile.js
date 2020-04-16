"use strict";
const configs = require("../../configs");
const sharp = require('sharp');
const fs = require('fs');
const exec = require('child_process').exec;
module.exports = async function(req, res, next) {
  try {
    const body = req.body;
    console.log(body);
    let storedPath = configs.uploadUrl + "/" + req.params.dir + "/" + req.file.filename;
    const upload_file = configs.uploadDir + "/" + req.params.dir + "/" + req.file.filename;
    if(req.file.filename.substr(req.file.filename.length-4)=='.jpg' || 
      req.file.filename.substr(req.file.filename.length-4)=='.jpeg' || req.file.filename.substr(req.file.filename.length-4)=='.png'){
        sharp(upload_file ).resize(req.params.dir=='profile'?300:1024)
        .toFile(configs.uploadDir + "/" + req.params.dir + "/" +
          req.file.filename.substr(0,req.file.filename.length-4)+'2'+req.file.filename.substr(req.file.filename.length-4)
          ).then(
          (f)=>{
            fs.unlinkSync(upload_file)
          }).catch((err) => {
          console.log('err: ', err); }); 
      res.json({ uri: configs.uploadUrl + "/" + req.params.dir + "/" +
        req.file.filename.substr(0,req.file.filename.length-4)+'2'+req.file.filename.substr(req.file.filename.length-4)});
    // ".mp3",".wav",".flac",".aiff",".ogg"
    }else if(req.file.filename.substr(req.file.filename.length-4)=='.mp3' ||
      req.file.filename.substr(req.file.filename.length-4)=='.wav' ||
      req.file.filename.substr(req.file.filename.length-5)=='.flac' ||
      req.file.filename.substr(req.file.filename.length-5)=='.aiff' ||
      req.file.filename.substr(req.file.filename.length-4)=='.ogg'){
        exec('sox ' + upload_file + ' -r 8000 -c 1 ' + upload_file.substr(0,upload_file.length-5) + '2.mp3' + ' && rm ' + upload_file,
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                 console.log('exec error: ' + error);
            }
        })
        console.log(storedPath.substr(0,storedPath.length-5) + '2.mp3')
        res.json({ uri:(storedPath.substr(0,storedPath.length-5) + '2.mp3')});
        ;
    }else{
      res.json({ uri:storedPath});
    }
  } catch (err) {
    console.log(err);
    if (err.is(2)) {
      return next(new ExternalError(25));
    }
    next(err);
  }
};
