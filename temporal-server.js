
Temporal.Collection = function(source, name, options) {
	var self = this;
	this._options = options || {};
	var collection = this._collection = new Mongo.Collection(name, options);
	source.after.insert(function(userId, doc) {
		var time = new Date;
		self.startRecord(doc, time, userId);
	});
	source.after.update(function(userId, doc) {
		var time = new Date;
		var _id = doc._id;
		self.stopRecord(_id, time, userId);
		self.startRecord(doc, time, userId);
	});
	source.after.remove(function(userId, doc) {
		var time = new Date;
		var _id = doc._id;
		self.stopRecord(_id, time, userId);
	});
}

_.extend(Temporal.Collection.prototype, {
	publish: function(publisher, name, time, selector, options) {
		var collectionOptions = this.options();
		this.find(time, selector, options).forEach(function(doc) {
			var _id = doc[collectionOptions.idField];
			delete doc[collectionOptions.idField];
			publisher.added(name, _id, doc);
		});
	},

	lastWrite: function() {

	},

	startRecord: function(doc, time, userId) {
		var options = this.options();
		doc[options.idField] = doc._id;
		delete doc._id;
		doc[options.userField] = userId;
		doc[options.fromField] = time;
		delete doc[options.toField];
		return this._collection.insert(doc);
	},
	stopRecord: function(_id, time, userId) {
		var options = this.options();
		var selector = {};
		selector[options.idField] = _id;
		selector[options.toField] = null;

		var modifier = {$set: {}};
		modifier.$set[options.toField] = time;

		return this._collection.update(selector, modifier);
	},
});
