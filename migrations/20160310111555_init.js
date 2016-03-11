
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("case_record", function(table) {
			table.increments("cr_id").primary();
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("defendant_first");
			table.string("defendant_last");
			table.date("disposition_date");
			table.string("disposition_code");
			table.float("bail_amount");
			table.integer("ssn");
			table.date("birth_date");
			table.string("race_code");
			table.string("gender");
			table.string("disposition_desc");
			table.string("booking_num");
		}),
		knex.schema.createTable("court_event", function(table) {
			table.increments("ce_id").primary();
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("defendant_first");
			table.string("defendant_last");
			table.date("appear_date");
			table.time("appear_time");
			table.string("hearing_code");
			table.string("court_room");
			table.string("court_int_case_num");
			table.dateTime("created");
			table.dateTime("cancelled");
			table.string("cancel_reason");
		}),
		knex.schema.createTable("charge_record", function(table) {
			table.increments("ch_id").primary();
			table.string("location_code");
			table.string("court_type");
			table.string("party_num");
			table.string("case_num");
			table.string("violation_code");
			table.string("severity");
			table.string("charge_sequence");
			table.float("amount_due");
			table.string("judgement_code");
			table.string("case_type");
			table.string("offense_desc");
			table.date("violation_date");
			table.date("arrest_date");
			table.date("judgement_date");
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
