Temporal = {};

Temporal._defaults = {
	idField: '_revisionDocId',
	fromField: '_revisionFrom',
	toField: '_revisionTo',
	userField: '_revisionUserId',
};

Temporal.options = function(option, value) {
	if(arguments.length == 0) {
		return _.clone(Temporal._defaults);
	} else if(arguments.length == 1) {
		check(option, Match.OneOf(Object, String))
		if(Match.test(option, String)) {
			return Temporal._defaults[option];
		} else if(Match.test(option, Object)) {
			_.extend(Temporal._defaults, option);
		}
	} else if(arguments.length == 2) {
		check(option, String);
		Temporal._defaults[option] = value;
	}
}
