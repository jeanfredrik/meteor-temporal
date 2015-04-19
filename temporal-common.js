
_.each(['find', 'findOne'], function(fn) {
	Temporal.Collection.prototype[fn] = function(time, selector, options) {
		check(time, Date);
		check(options, Match.Optional(Object));
		options = _.extend(Temporal.options(), options || {});
		if(Match.test(selector, Object)) {
			//If selector is an object, eg {name: '…', weight: {$gt: 2}}
			if(_.has(selector, '_id')) {
				selector[options.idField] = selector._id;
				delete selector._id;
			}
		} else if(Match.test(selector, String)) {
			//If selector is an ID
			var _id = selector;
			selector = {};
			selector[options.idField] = _id;
		} else {
			selector = {};
		}
		selector[options.fromField] = {$not: {$gt: time}}; //we use $not to match undefined
		selector[options.toField] = {$not: {$lte: time}};
		function transform(doc) {
			//doc._id = doc[options.idField];
			//delete doc[options.idField];
			delete doc[options.toField];
			delete doc[options.fromField];
			delete doc[options.userField];
			return doc;
		}
		if(_.isFunction(options.transform)) {
			options.transform = _.compose(options.transform, transform);
		} else {
			options.transform = transform;
		}
		return this._collection[fn](selector, options);
	}
});

_.extend(Temporal.Collection.prototype, {
	options: function() {
		return _.extend({}, this._options, Temporal.options());
	},
});
