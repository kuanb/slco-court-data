// creds, settings
var creds = require("../credentials.js");

// app initialization
var express = require("express");
var app = express();

// establish database connection
var db = require("./db");

// libraries
var csv = require("csv");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/api/v0", function (req, res) {
	var request = {
		url: req.protocol + '://' + req.get('host') + req.originalUrl,
		params: req.query,
		received_at: new Date(Date.now()).toUTCString()
  }


	var q = db("case_record")
					.innerJoin("court_event", function () {
						this.on("case_record.party_num", "=", "court_event.party_num")
						.andOn("case_record.case_num", "=", "court_event.case_num")
					}).limit(100);

	if (req.query.hasOwnProperty("first_name")) {
		var first = req.query.first_name.toUpperCase();
		q.where("case_record.defendant_first", "like", "%" + first + "%");
	}
	if (req.query.hasOwnProperty("last_name")) {
		var last = req.query.last_name.toUpperCase();
		q.where("case_record.defendant_last", "like", "%" + last + "%");
	}
	if (req.query.hasOwnProperty("dob")) {
		var dob = req.query.dob.toUpperCase();
		q.where("case_record.birth_date", "=", dob);
	}

	q.then(function (defendants) {

		defendants = defendants.map(function (d) {
			var revised = {
				location_code: d.location_code,
				court_type: d.court_type,
				party_num: d.party_num,
				case_num: d.case_num,
				defendant_first: d.defendant_first,
				defendant_last: d.defendant_last,
				disposition_date: d.disposition_date,
				disposition_code: d.disposition_code,
				bail_amount: d.bail_amount,
				birth_date: d.birth_date == null ? null : new Date(d.birth_date).toDateString(),
				race_code: d.race_code,
				gender: d.gender,
				disposition_desc: d.disposition_desc,
				booking_num: d.booking_num,
				appear_date: d.appear_date == null ? null : new Date(d.appear_date).toDateString(),
				appear_time: d.appear_time,
				hearing_code: d.hearing_code,
				court_room: d.court_room,
				court_int_case_num: d.court_int_case_num,
				created: d.created == null ? null : new Date(d.created).toDateString(),
				cancelled: d.cancelled == null ? null : new Date(d.cancelled).toDateString(),
				cancel_reason: d.cancel_reason
			};
			return revised;
		});

		res.json({
		  request: request,
		  processed_at: new Date(Date.now()).toUTCString(),
		  errors: [],
		  results_count: defendants.length,
		  results: defendants
		});

	}).catch(function (error) {
		res.json({
		  request: request,
		  processed_at: new Date(Date.now()).toUTCString(),
		  errors: [error],
		  results_count: 0,
		  results: []
		})
	});

});



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


var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });





