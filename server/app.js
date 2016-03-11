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


app.get("/api/v1", function (req, res) {
	var request = {
		url: req.protocol + '://' + req.get('host') + req.originalUrl,
		params: req.query,
		received_at: new Date(Date.now()).toUTCString()
  }

	var processed_at = new Date(Date.now()).toUTCString();

	var first = "%", 
			last = "%", 
			dob = "%";
	// if (req.params.hasOwnProperty("first_name"))
	
	db("case_record").join()
	.join("court_event", function () {
		this.on("case_record.party_num", "=", "court_event.party_num")
		.andOn("case_record.case_num", "=", "court_event.case_num")
		.andOn("case_record.case_num", "=", "court_event.case_num")
	})
	.where("defendant_first", "like", first).limit(5).then(function (defendants) {

		res.send({
		  request: request,
		  processed_at: processed_at,
		  errors: [],
		  results_count: defendants.length,
		  results: defendants
		});

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





