/*************************************** FILE DESCRIPTION *****************************************/

// This script describes routes concerning articles.

/*************************************** EXTERNAL IMPORTS *****************************************/

var fs = require('fs');
var path = require('path');

/*************************************** INTERNAL IMPORTS *****************************************/

var logger = require("../../util/log"); // Our custom logging utility

/******************************************** MODULE **********************************************/

var uploadRom = function(req, res){
	var fileName = req.files.file.originalFilename; 
	fs.readFile(req.files.file.path, function (err, data) {
		if(err) throw err;
		var newPath = path.resolve(__dirname, "../../", "uploads");
		console.log(newPath);
		fs.writeFile(newPath, data, function (err) {
			res.send(200, 'upload succeded');
		});
	});
}

/******************************************* EXPORTS **********************************************/

// This controller's HTTP routes
module.exports.routes = [
{
    path: "/roms/upload",
    method: "POST",
    handler: uploadRom
}];