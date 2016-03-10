// creds, settings
var creds = require("../credentials.js");

// app initialization
var express = require("express");
var app = express();

// libraries
var JSFtp = require("jsftp");
var AWS = require("aws-sdk");
var csv = require("csv");


var ftp = new JSFtp(creds.ftp);
console.log("Loaded");

var str = "";
ftp.get("./incoming/vine_case.ul", function (err, socket) {
	if (err) {
		return false;
	} else {
		socket.on("data", function (d) { str += d.toString(); })
		socket.on("close", function (err) {
			if (err) {
				console.error("Error retrieving the file: ", err);
			} else {
				csv.parse(str, {delimiter: "\t"}, function (err, output) {
					if (err) {
						return false
					} else {
						console.log("DONE", output[0])
					}
				});
			}
		});
		socket.resume();
	}
});



// var port = 4040;
// app.listen(port, function () { console.log("Listening on port", port); });




