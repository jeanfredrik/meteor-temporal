
Temporal.Collection = function(source, name, options) {
	this._collection = new Mongo.Collection(name, options);
}
