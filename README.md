# Temporal
With this Meteor package you can record all changes to your collections and store them in the database. You can also publish the collection the way it was at a certain point in time.

## Create collection
Create a collection for your revisions by using `new Temporal.Collection`, like this:

```javascript
new Temporal.Collection(collection, name, options);
```

- `collection`: is the regular Mongo.Collection on which you want to record changes.
- `name`: is the name of the collection that will be created in the Mongo DB, just like in `new Mongo.Collection`.
- `options`: is a dictionary of additonal options. All the options of `new Mongo.Collection` is available, like `transform`.

Example:

```javascript
PostRevisions = new Temporal.Collection(People, 'people.revisions');
```
This will create a new collection named “people.revisions” and changes made to `People` via insert, update and remove will be saved to the collection.

## Find revisions
The `Temporal.Collection` instance has `find` and `findOne` methods. These work like usual, except that you must also provide a `Date` object specifying the point in time you want to get revisions for.

### _collection_.find(time, [selector], [options])
- `time`: a `Date` object.
- `selector`: (optional) a query describing the documents to find.
- `options`: (optional) a dictionary of options like sort, skip, limit and transform.

Returns a cursor. The documents will have a `_revisionDocId` field containing the ID of the original document. This hopefully change in a future release so that the ID is the same as the original documents ID.

### _collection_.findOne(time, [selector], [options])
- `time`: a `Date` object.
- `selector` (optional): a query describing the documents to find.
- `options` (optional): a dictionary of options like sort, skip, limit and transform.

Returns a single document.

## Publish revisions

For convenience the `Temporal.Collection` instance has a `publish` method that can be used inside a `Meteor.publish`.

### _collection_.publish(publisher, name, time, [selector], [options])
- `publisher`: the context of the `Meteor.publish`.
- `name`: the name of the collection in which the client will store the published documents.

Example:

```javascript
// On the server
Meteor.publish('posts', function(time) {
	if(time) {
		PostRevisions.publish(this, 'people', time);
		this.ready();
	} else {
		return Posts.find();
	}
});

// On the client. Will get the posts from the regular collection
Meteor.subscribe('posts');

// On the client. Will get post revisions defined by the second argument. The documents are transformed before publish so that the ID of the documents will the original ID.
Meteor.subscribe('posts', new Date('2015-04-19 15:47'));
```
