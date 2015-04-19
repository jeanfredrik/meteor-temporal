Package.describe({
	name: 'jeanfredrik:temporal',
	version: '0.1.0',
	summary: 'Record changes and create revisions with temporal collections',
	git: 'https://github.com/jeanfredrik/meteor-temporal.git',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.1.0.2');

	api.use('check');
	api.use('mongo');
	api.use('underscore');

	api.use('matb33:collection-hooks@0.7.11');

	api.addFiles('temporal.js');
	api.addFiles('temporal-client.js', 'client');
	api.addFiles('temporal-server.js', 'server');
	api.addFiles('temporal-common.js');

  api.export('Temporal');
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use('jeanfredrik:temporal');
	api.addFiles('temporal-tests.js');
});
