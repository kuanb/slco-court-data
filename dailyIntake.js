// creds, settings
var creds = require("./credentials.js");

// establish database connection
var db = require("./server/db");

// libraries
var JSFtp = require("jsftp");
var AWS = require("aws-sdk");
var csv = require("csv");

function pullFromFTP (filename, tablename) {
	var str = "";
	var ftp = new JSFtp(creds.ftp);
	ftp.get("./incoming/" + filename, function (err, socket) {
		if (err) {
			console.error("Error retrieving the file: ", err);
		} else {
			socket.on("data", function (d) { str += d.toString(); })
			socket.on("close", function (err) {
				if (err) {
					console.error("Error streaming the file: ", err);
				} else {
					parseAndInput(str, tablename)
				}
			});
			socket.resume();
		}
	});
};

function parseAndInput (str, tablename) {
	csv.parse(str, {
		rowDelimited: "\r\r\n",
		delimiter: "\t",
		skip_empty_lines: true,
		trim: true,
		auto_parse_date: true
	}, function (err, output) {
		if (err) {
			console.log("Error occured while parsing a row from " + tablename + ": ", err)
		} else {
			console.log(output.length + " entries for " + tablename + ".");

			var inputArray = [];

			for (var i = 0 ; i < output.length; i++ ) {
				var o = output[i];
				var e;

				if (tablename == "case_record") {
					e = {
						location_code:    !o[1]  ? null : o[1],
						court_type:       !o[2]  ? null : o[2],
						party_num:        !o[3]  ? null : o[3],
						case_num:         !o[4]  ? null : o[4],
						defendant_first:  !o[5]  ? null : o[5],
						defendant_last:   !o[6]  ? null : o[6],
						disposition_date: !o[7]  ? null : o[7],
						disposition_code: !o[8]  ? null : o[8],
						bail_amount:      !o[9]  ? null : o[9],
						ssn:              !o[10] ? null : o[10],
						birth_date:       !o[11] ? null : o[11],
						race_code:        !o[12] ? null : o[12],
						gender:           !o[13] ? null : o[13],
						disposition_desc: !o[14] ? null : o[14],
						booking_num:      !o[15] ? null : o[15]
					};

					// clean up certain types
					if (e.disposition_date) {
						e.disposition_date = new Date(e.disposition_date).toISO_YYYYMMDD();
					}
					if (e.bail_amount) {
						e.bail_amount = Math.ceil(Number(e.bail_amount) * 100) / 100;
					}
					if (e.ssn) {
						e.ssn = Number(e.ssn.replace(/[^0-9]/, ''));
					}
					if (e.birth_date) {
						e.birth_date = new Date(e.birth_date).toISO_YYYYMMDD();
					}

				} else if (tablename == "court_event") {
					e = {
						location_code:      !o[1]  ? null : o[1],
						court_type:         !o[2]  ? null : o[2],
						party_num:          !o[3]  ? null : o[3],
						case_num:           !o[4]  ? null : o[4],
						defendant_first:    !o[5]  ? null : o[5],
						defendant_last:     !o[6]  ? null : o[6],
						appear_date:        !o[7]  ? null : o[7],
						appear_time:        !o[8]  ? null : o[8],
						hearing_code:       !o[9]  ? null : o[9],
						court_room:         !o[10] ? null : o[10],
						court_int_case_num: !o[11] ? null : o[11],
						created:            !o[12] ? null : o[12],
						cancelled:          !o[13] ? null : o[13],
						cancel_reason:      !o[14] ? null : o[14]
					};

					// clean up certain types
					if (e.appear_date) {
						e.appear_date = new Date(e.appear_date).toISO_YYYYMMDD();
					}
					if (e.appear_time) {
						var t = e.appear_time
						if (isNaN(t.split(":")[0]) || isNaN(t.split(":")[1])) {
							e.appear_time = null;
						}
					}
					if (e.created) {
						var d = new Date(e.created);
						if (Object.prototype.toString.call(d) === "[object Date]") {
						  if (isNaN(d.getTime())) { e.created = null; }
						} else {
						  e.created = null;
						}
					}
					if (e.cancelled) {
						var d = new Date(e.cancelled);
						if (Object.prototype.toString.call(d) === "[object Date]") {
						  if (isNaN(d.getTime())) { e.cancelled = null; }
						} else {
						  e.cancelled = null;
						}
					}

				} else if ("charge_record") {
					e = {
						location_code:   !o[1]  ? null : o[1],
						court_type:      !o[2]  ? null : o[2],
						party_num:       !o[3]  ? null : o[3],
						case_num:        !o[4]  ? null : o[4],
						violation_code:  !o[5]  ? null : o[5],
						severity:        !o[6]  ? null : o[6],
						charge_sequence: !o[7]  ? null : o[7],
						amount_due:      !o[8]  ? null : o[8],
						judgement_code:  !o[9]  ? null : o[9],
						case_type:       !o[10] ? null : o[10],
						offense_desc:    !o[11] ? null : o[11],
						violation_date:  !o[12] ? null : o[12],
						arrest_date:     !o[13] ? null : o[13],
						judgement_date:  !o[14] ? null : o[14],
						judgement_desc:  !o[15] ? null : o[15]
					};

					// clean up certain types
					if (e.amount_due) {
						e.amount_due = Math.ceil(Number(e.amount_due) * 100) / 100;
					}
					if (e.violation_date) {
						var d = new Date(e.violation_date);
						if (Object.prototype.toString.call(d) === "[object Date]") {
						  if (isNaN(d.getTime())) { e.violation_date = null; }
						} else {
						  e.violation_date = null;
						}
					}
					if (e.arrest_date) {
						var d = new Date(e.arrest_date);
						if (Object.prototype.toString.call(d) === "[object Date]") {
						  if (isNaN(d.getTime())) { e.arrest_date = null; }
						} else {
						  e.arrest_date = null;
						}
					}
					if (e.judgement_date) {
						var d = new Date(e.judgement_date);
						if (Object.prototype.toString.call(d) === "[object Date]") {
						  if (isNaN(d.getTime())) { e.judgement_date = null; }
						} else {
						  e.judgement_date = null;
						}
					}

				} else {
					throw Error("Bad tablename.")
				};

				validateInput(e, tablename, function (inputOK, validEntry) {
					if (inputOK) {
						db(tablename).insert(validEntry).then(function (resp) {
							// console.log("Entry success.");
						}).catch(function (err) {
							console.log("Entry error: ", err);
						});
					}
				});
			}
		}
	});
};

function validateInput (e, tablename, cb) {

	var ok = true;
	if (tablename == "case_record") {
		if (e.party_num == undefined) { ok = false; }
		if (e.case_num == undefined) { ok = false; }
		if (e.defendant_first == undefined && e.defendant_last == undefined) { ok = false; }

		if (ok) {
			db(tablename)
			.where("party_num", e.party_num)
			.andWhere("case_num", e.case_num)
			.andWhere("defendant_first", e.defendant_first)
			.andWhere("defendant_last", e.defendant_last)
			.limit(1).then(function (resp) {
				if (resp.length > 0) { 
					cb(false);
				} else {
					cb(true, e);
				}
			});
		} else {
			cb(false);
		}

	} else if (tablename == "court_event") {
		if (e.party_num == undefined) { ok = false; }
		if (e.case_num == undefined) { ok = false; }
		if (e.defendant_first == undefined) { ok = false; }
		if (e.defendant_last == undefined) { ok = false; }

		if (ok) {
			db(tablename)
			.where("party_num", e.party_num)
			.andWhere("case_num", e.case_num)
			.andWhere("defendant_first", e.defendant_first)
			.andWhere("defendant_last", e.defendant_last)
			.limit(1).then(function (resp) {
				if (resp.length > 0) { 
					cb(false);
				} else {
					cb(true, e);
				}
			});
		} else {
			cb(false);
		}

	} else if ("charge_record") {
		if (e.party_num == undefined) { ok = false; }
		if (e.case_num == undefined) { ok = false; }

		if (ok) {
			db(tablename)
			.where("party_num", e.party_num)
			.andWhere("case_num", e.case_num)
			.limit(1).then(function (resp) {
				if (resp.length > 0) { 
					cb(false);
				} else {
					cb(true, e);
				}
			});
		} else {
			cb(false);
		}

	} else {
		cb(false);
	};
};

// utilities
if (!Date.prototype.toISO_YYYYMMDD) {
  (function() {
    function pad(number) {
      var r = String(number);
      if ( r.length === 1 ) {
        r = '0' + r;
      }
      return r;
    }
    Date.prototype.toISO_YYYYMMDD = function() {
      return this.getUTCFullYear()
        + '-' + pad( this.getUTCMonth() + 1 )
        + '-' + pad( this.getUTCDate() );
    };
  }());
};

// run 'em all
pullFromFTP("vine_case.ul", "case_record");
pullFromFTP("vine_charge.ul", "charge_record");
pullFromFTP("vine_court_event.ul", "court_event");
