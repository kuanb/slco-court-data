
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("case_record", function(table) {
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("defendant_first");
			table.string("defendant_last");
			table.string("disposition_date");
			table.string("disposition_code");
			table.string("bail_amount");
			table.string("ssn");
			table.string("birth_date");
			table.string("race_code");
			table.string("gender");
			table.string("disposition_desc");
			table.string("booking_num");
		}),
		knex.schema.createTable("court_event", function(table) {
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("defendant_first");
			table.string("defendant_last");
			table.string("appear_date");
			table.string("appear_time");
			table.string("hearing_code");
			table.string("court_room");
			table.string("court_int_case_num");
			table.string("created");
			table.string("cancelled");
			table.string("cancel_reason");
		}),
		knex.schema.createTable("charge_record", function(table) {
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("violation_code");
			table.string("severity");
			table.string("charge_sequence");
			table.string("amount_due");
			table.string("judgement_code");
			table.string("case_type");
			table.string("offense_desc");
			table.string("violation_date");
			table.string("arrest_date");
			table.string("judgement_date");
			table.string("judgement_desc");
		})
	])
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable("case_record"),
		knex.schema.dropTable("court_event"),
		knex.schema.dropTable("charge_record")
	])
};
