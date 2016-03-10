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
				csv.parse(str, {
					delimiter: "\t",
					skip_empty_lines: true,
					trim: true,
					auto_parse_date: true
				}, function (err, output) {
					if (err) {
						return false
					} else {

						var o = output[172];
						for (var i = 0 ; i < o.length; i++ ) {
							console.log(i + ": " + o[i]);
						}
						var e = {

						}
						console.log("DONE", e)
					}
				});
			}
		});
		socket.resume();
	}
});



// var port = 4040;
// app.listen(port, function () { console.log("Listening on port", port); });




// // case record
// location_code: o[1] == false ? null : o[1],
// court_type: o[2] == false ? null : o[2],
// party_num: o[3] == false ? null : o[3],
// case_num: o[4] == false ? null : o[4],
// defendant_first: o[5] == false ? null : o[5],
// defendant_last: o[6] == false ? null : o[6],
// disposition_date: o[7] == false ? null : o[7],
// disposition_code: o[8] == false ? null : o[8],
// bail_amount: o[9] == false ? null : o[9],
// ssn: o[10] == false ? null : o[10],
// birth_date: o[11] == false ? null : o[11],
// race_code: o[12] == false ? null : o[12],
// gender: o[13] == false ? null : o[13],
// disposition_desc: o[14] == false ? null : o[14],
// booking_num: o[15] == false ? null : o[15]

// // court event record
// location_code: o[1] == false ? null : o[1],
// court_type: o[2] == false ? null : o[2],
// party_num: o[3] == false ? null : o[3],
// case_num: o[4] == false ? null : o[4],
// defendant_first: o[5] == false ? null : o[5],
// defendant_last: o[6] == false ? null : o[6],
// appear_date: o[7] == false ? null : o[7],
// appear_time: o[8] == false ? null : o[8],
// hearing_code: o[9] == false ? null : o[9],
// court_room: o[10] == false ? null : o[10],
// court_int_case_num: o[11] == false ? null : o[11],
// created: o[12] == false ? null : o[12],
// cancelled: o[13] == false ? null : o[13],
// cancel_reason: o[14] == false ? null : o[14]

// // charge record
// location_code: o[1] == false ? null : o[1],
// court_type: o[2] == false ? null : o[2],
// party_num: o[3] == false ? null : o[3],
// case_num: o[4] == false ? null : o[4],
// violation_code: o[5] == false ? null : o[5],
// severity: o[6] == false ? null : o[6],
// charge_sequence: o[7] == false ? null : o[7],
// amount_due: o[8] == false ? null : o[8],
// judgement_code: o[9] == false ? null : o[9],
// case_type: o[10] == false ? null : o[10],
// offense_desc: o[11] == false ? null : o[11],
// violation_date: o[12] == false ? null : o[12],
// arrest_date: o[13] == false ? null : o[13],
// judgement_date: o[14] == false ? null : o[14],
// judgement_desc: o[15] == false ? null : o[15]



